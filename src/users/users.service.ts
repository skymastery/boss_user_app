import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entity/user.entity'
import { Repository } from 'typeorm'
import { UserCredsDto } from './dto/UserCreds.dto'
import crypto from 'node:crypto'
import * as jose from 'jose'
import { createSecretKey } from 'node:crypto'
import { IAuthJwt } from '../_shared/interfaces'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
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
    let newUser = UsersService.register(inputData)
    newUser = await this.userRepository.create(newUser)

    await this.userRepository.save(newUser)
    return newUser
  }

  async getAllUsers() {
    const users = await this.userRepository.find()
    return users
  }

  private static generatePasswordSalt() {
    return crypto.randomBytes(120).toString('hex')
  }

  static register(inputData: UserCredsDto): User {
    const newUser = new User()
    newUser.username = inputData.username

    const hashedData = this.generateHashedPassword(inputData.password)
    newUser.passwordSalt = hashedData.salt
    newUser.passwordHashed = hashedData.passwordHashed

    return newUser
  }

  public async authenticate(userDto: UserCredsDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: userDto.username,
      },
    })
    console.log(1)
    if (!user) {
      throw new BadRequestException('Username or password incorrect.')
    }
    console.log(2)
    const isValidPassword = this.validatePassword(
      userDto.password,
      user.passwordSalt,
      user.passwordHashed
    )

    if (!isValidPassword) {
      throw new BadRequestException('Username or password incorrect.')
    }
    console.log(3)
    return {
      ...(await this._generateSession(user)),
    }
  }
  private async _generateSession(
    user: User
  ): Promise<{ user: User; auth: { accessToken: string } }> {
    return {
      user: user,
      auth: {
        accessToken: await this._generateAuthJwtToken(user.id),
      },
    }
  }

  private async _generateAuthJwtToken(userId: number): Promise<string> {
    const secretKey = createSecretKey(process.env.JWT_AUTH_TOKEN_KEY, 'utf-8')

    return new jose.SignJWT({ id: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('90d')
      .sign(secretKey)
  }

  public async validateAuthJwt(authHeader: string): Promise<IAuthJwt> {
    if (authHeader.split(' ')[0] !== 'Bearer') {
      throw new BadRequestException('Token is either invalid or expired.')
    }
    const token = authHeader.split(' ')[1]
    return jose
      .jwtVerify(
        token,
        createSecretKey(process.env.JWT_AUTH_TOKEN_KEY, 'utf-8')
      )
      .then((decoded) => {
        return decoded.payload as IAuthJwt
      })
      .catch(() => {
        return null
      })
  }

  public validatePassword(
    providedPassword: string,
    salt: string,
    existingPassword: string
  ): boolean {
    const saltWithMagic = UsersService._hash(salt, process.env.MAGIC_SALT)
    const generatedHash = UsersService._hash(providedPassword, saltWithMagic)

    return generatedHash === existingPassword
  }

  private static generateHashedPassword(newPass: string) {
    const salt = this.generatePasswordSalt()
    const saltWithMagic = this._hash(salt, process.env.MAGIC_SALT)
    const passwordHashed = this._hash(newPass, saltWithMagic)
    return {
      salt,
      passwordHashed,
    }
  }

  private static _hash(secret: string, salt: string): string {
    return crypto.pbkdf2Sync(secret, salt, 1000, 120, 'sha512').toString('hex')
  }
}
