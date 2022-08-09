import { Body, Controller, Post } from '@nestjs/common'
import { UserCredsDto } from '../users/dto/UserCreds.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: UserCredsDto): Promise<any> {
    return this.authService.authenticate(body)
  }
}
