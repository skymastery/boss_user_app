import { Body, Controller, Post } from '@nestjs/common'
import { UserCredsDto } from '../users/dto/UserCreds.dto'
import { AuthService } from './auth.service'
import { TokenOutputDto } from './dto/TokenOutput.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: UserCredsDto): Promise<TokenOutputDto> {
    return this.authService.authenticate(body)
  }
}
