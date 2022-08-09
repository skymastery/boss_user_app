import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/CreateUser.dto'
import { UserCredsDto } from './dto/UserCreds.dto'

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

  // @UseInterceptors(ClassSerializerInterceptor)
  // @SerializeOptions({})
  @Get('getUsers')
  async getAllUsers() {
    return this.usersService.getAllUsers()
  }

  @Get('subordinates/:id')
  async getAllSubordinates(@Param('id') id: number) {
    return this.usersService.getSubordinatesOfUser(id)
  }

  @Patch('upd')
  async updUser(@Body() body: any): Promise<any> {
    return this.usersService.assignBossToUser(body)
  }
}
