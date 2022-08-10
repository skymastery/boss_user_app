import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entity/user.entity'
import { Repository } from 'typeorm'
import { UserCredsDto } from './dto/UserCreds.dto'
import { AuthService } from '../auth/auth.service'
import { AssignBossDto } from './dto/AssignBoss.dto'
import { getRecursiveSubordinatesSqlString } from '../_shared/queries/sql_getRecursiveSubordinates'
import { ResponseMsgDto } from './dto/ResponseMsg.dto'
import { GetAllUsersOutputDto } from './dto/GetAllUsersOutput.dto'
import { SubordinatesOutputDto } from './dto/SubordinatesOutput.dto'
import { CreateUserDto } from './dto/CreateUser.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthService
  ) {}

  async createUser(inputData: CreateUserDto): Promise<ResponseMsgDto> {
    const userExists = await this.userRepository.findOne({
      where: {
        username: inputData.username,
      },
    })
    if (userExists)
      throw new BadRequestException('User with this username exists')
    if (inputData.boss) {
      const bossExists = await this.userRepository.findOne({
        where: {
          id: inputData.boss,
        },
      })
      if (!bossExists) throw new BadRequestException('Invalid boss id')
    }
    let newUser = this.getUserWithHashedData(inputData)
    newUser = await this.userRepository.create(newUser)

    await this.userRepository.save(newUser)
    return {
      msg: `User (id: ${newUser.id}, username:${newUser.username}) has been successfully registered.`,
    }
  }

  async getAllUsers(): Promise<GetAllUsersOutputDto> {
    const quantity = await this.userRepository.count()
    const allUsers = await this.userRepository.find({
      select: {
        id: true,
        username: true,
        boss: true,
        isAdmin: true,
      },
    })
    return {
      quantity,
      allUsers,
    }
  }

  async assignBossToUser(
    data: AssignBossDto,
    payloadId: string
  ): Promise<ResponseMsgDto> {
    const user = await this.userRepository.findOne({
      where: {
        id: data.futureSubordinateId,
      },
    })

    const recursiveSubordinates = await this.queryRecursiveSubordinates(
      payloadId
    )

    let subordinateValidation: boolean
    for (const subordinate of recursiveSubordinates) {
      if (subordinate.id === payloadId) {
        continue
      }
      if (subordinate.id === data.futureSubordinateId) {
        subordinateValidation = true
        break
      }
    }
    if (subordinateValidation !== true) {
      throw new HttpException('Access denied', 400)
    }
    user.boss = data.futureBossId
    await this.userRepository.update(user.id, user)
    return {
      msg: `User ${data.futureBossId} has been successfully assigned as boss of user ${data.futureSubordinateId}`,
    }
  }

  async queryRecursiveSubordinates(
    id: string
  ): Promise<SubordinatesOutputDto[]> {
    return this.userRepository.query(getRecursiveSubordinatesSqlString(id))
  }

  async getSubordinatesOfUser(
    id: string
  ): Promise<SubordinatesOutputDto[] | GetAllUsersOutputDto> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    })
    if (!user) {
      throw new HttpException('Incorrect user ID', 404)
    }

    if (user.isAdmin === true) {
      return this.getAllUsers()
    }

    return this.queryRecursiveSubordinates(id)
  }

  public getUserWithHashedData(inputData: UserCredsDto): User {
    const newUser = new User()
    newUser.username = inputData.username.toLowerCase()
    const hashedData = this.authService.generateHashedPassword(
      inputData.password
    )
    newUser.passwordSalt = hashedData.salt
    newUser.passwordHashed = hashedData.passwordHashed

    return newUser
  }
}
