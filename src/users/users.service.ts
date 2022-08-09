import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entity/user.entity'
import { Repository } from 'typeorm'
import { UserCredsDto } from './dto/UserCreds.dto'
import { AuthService } from '../auth/auth.service'
import { AssignBossDto } from './dto/AssignBoss.dto'
import { UserOutputDto } from './dto/UserOutput.dto'
import { getRecursiveSubordinatesSqlString } from '../_shared/queries/sql_getRecursiveSubordinates'
import { ResponseMsgDto } from './dto/ResponseMsg.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthService
  ) {}

  async createUser(inputData: UserCredsDto): Promise<ResponseMsgDto> {
    const userExists = await this.userRepository.findOne({
      where: {
        username: inputData.username,
      },
    })
    if (userExists) {
      throw new BadRequestException('User with this username exists')
    }
    let newUser = this.register(inputData)
    newUser = await this.userRepository.create(newUser)

    await this.userRepository.save(newUser)
    return {
      msg: `User (id: ${newUser.id}, username:${newUser.username}) has been successfully registered.`,
    }
  }

  async getAllUsers(): Promise<{ qty: number; users: UserOutputDto[] }> {
    const qty = await this.userRepository.count()
    const users = await this.userRepository.find({
      select: {
        id: true,
        username: true,
        boss: true,
        isAdmin: true,
      },
    })
    return {
      qty,
      users,
    }
  }

  async assignBossToUser(
    data: AssignBossDto,
    payloadId: number
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

  async queryRecursiveSubordinates(id: number) {
    return this.userRepository.query(getRecursiveSubordinatesSqlString(id))
  }

  async getSubordinatesOfUser(id: number) {
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

  public register(inputData: UserCredsDto): User {
    const newUser = new User()
    newUser.username = inputData.username
    const hashedData = this.authService.generateHashedPassword(
      inputData.password
    )
    newUser.passwordSalt = hashedData.salt
    newUser.passwordHashed = hashedData.passwordHashed

    return newUser
  }
}
