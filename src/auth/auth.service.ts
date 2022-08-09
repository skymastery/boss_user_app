import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entity/user.entity'
import { Repository } from 'typeorm'
import { UserCredsDto } from '../users/dto/UserCreds.dto'
import crypto from 'node:crypto'
import { createSecretKey } from 'node:crypto'
import * as jose from 'jose'
import { IAuthJwt } from '../_shared/interfaces'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  public async authenticate(userDto: UserCredsDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: userDto.username,
      },
    })
    if (!user) {
      throw new BadRequestException('Username or password incorrect.')
    }
    const isValidPassword = this.validatePassword(
      userDto.password,
      user.passwordSalt,
      user.passwordHashed
    )

    if (!isValidPassword) {
      throw new BadRequestException('Username or password incorrect.')
    }
    return {
      ...(await this._generateSession(user)),
    }
  }

  public async _generateSession(
    user: User
  ): Promise<{ user: User; auth: { accessToken: string } }> {
    return {
      user: user,
      auth: {
        accessToken: await this._generateAuthJwtToken(user.id),
      },
    }
  }

  public async _generateAuthJwtToken(userId: number): Promise<string> {
    const secretKey = createSecretKey(process.env.JWT_AUTH_TOKEN_KEY, 'utf-8')

    return new jose.SignJWT({ id: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('90d')
      .sign(secretKey)
  }

  public validatePassword(
    providedPassword: string,
    salt: string,
    existingPassword: string
  ): boolean {
    const saltWithMagic = this._hash(salt, process.env.MAGIC_SALT)
    const generatedHash = this._hash(providedPassword, saltWithMagic)

    return generatedHash === existingPassword
  }

  generateHashedPassword(newPass: string) {
    const salt = this.generatePasswordSalt()
    const saltWithMagic = this._hash(salt, process.env.MAGIC_SALT)
    const passwordHashed = this._hash(newPass, saltWithMagic)
    return {
      salt,
      passwordHashed,
    }
  }

  generatePasswordSalt() {
    return crypto.randomBytes(120).toString('hex')
  }

  _hash(secret: string, salt: string): string {
    return crypto.pbkdf2Sync(secret, salt, 1000, 120, 'sha512').toString('hex')
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
}
