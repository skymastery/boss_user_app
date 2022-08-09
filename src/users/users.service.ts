import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entity/user.entity'
import { Repository } from 'typeorm'
import { UserCredsDto } from './dto/UserCreds.dto'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthService
  ) {}

  async createUser(inputData: UserCredsDto) {
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
    return newUser
  }

  async getAllUsers() {
    const qty = await this.userRepository.count()
    const users = await this.userRepository.find({
      select: {
        id: true,
        username: true,
        boss: true,
      },
    })
    return {
      qty,
      users,
    }
  }

  async assignBossToUser(data: any, payloadId: any) {
    const user = await this.userRepository.findOne({
      where: {
        id: data.futureSubordinateId,
      },
    })

    const recursiveSubordinates = await this.queryRecursiveSubordinates(
      payloadId
    )

    let subordinateValidation // boolean
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
    return await this.userRepository.query(
      `WITH RECURSIVE subordinates AS (
 SELECT
  id,
  username,
  boss

 FROM
    "user"
 WHERE
  id = ${id}
 UNION
  SELECT
   u.id,
   u.username,
   u.boss
   
  FROM
   "user" u
  INNER JOIN subordinates s ON s.id = u.boss
) SELECT
 *
FROM
 subordinates`
    )
  }

  async getSubordinatesOfUser(id: any) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    })
    if (!user) {
      throw new HttpException('Incorrect user ID', 404)
    }

    if (user.isAdmin === true) {
      return await this.getAllUsers()
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
