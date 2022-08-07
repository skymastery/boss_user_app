import { Body, Controller, Get, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/CreateUser.dto'
import { UserCredsDto } from './dto/UserCreds.dto'
import { UserOutputDto } from './dto/UserOutput.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto)
  }

  @Post('login')
  async login(@Body() body: UserCredsDto): Promise<any> {
    return this.usersService.authenticate(body)
  }

  @Get('getUsers')
  async getAllUsers(): Promise<UserOutputDto[]> {
    return this.usersService.getAllUsers()
  }
}
