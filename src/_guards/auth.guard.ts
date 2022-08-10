import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entity/user.entity'
import { Repository } from 'typeorm'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()

    const token = req.headers.authorization
    if (!token) {
      throw new UnauthorizedException('No Authorization token provided')
    }

    const payload = await this.authService.validateAuthJwt(token)
    if (!payload) {
      throw new UnauthorizedException('Invalid Authorization token')
    }
    let user
    try {
      user = await this.userRepository.findOne({
        where: {
          id: <string>payload.id,
        },
      })
    } catch (e) {
      console.log('Guard error: ' + e)
      throw new BadRequestException('Authentication failed')
    }
    if (!user) {
      throw new UnauthorizedException(
        'Authentication failed. Token is valid, but this user is not found.'
      )
    }
    req.userId = <string>user.id

    return true
  }
}
