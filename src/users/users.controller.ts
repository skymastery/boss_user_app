import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/CreateUser.dto'
import { JwtAuthGuard } from '../_guards/auth.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('subordinates')
  async getAllSubordinates(@Req() req: any) {
    return this.usersService.getSubordinatesOfUser(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('assignBoss')
  async updUser(@Body() body: any, @Req() req: any): Promise<any> {
    return this.usersService.assignBossToUser(body, req.userId)
  }
}
