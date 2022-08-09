import { Body, Controller, Post } from '@nestjs/common'
import { UserCredsDto } from '../users/dto/UserCreds.dto'
import { AuthService } from './auth.service'
import { User } from '../entity/user.entity'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: UserCredsDto
  ): Promise<{ user: User; auth: { accessToken: string } }> {
    return this.authService.authenticate(body)
  }
}
