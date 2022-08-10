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
import { AssignBossDto } from './dto/AssignBoss.dto'
import { ResponseMsgDto } from './dto/ResponseMsg.dto'
import { SubordinatesOutputDto } from './dto/SubordinatesOutput.dto'
import { GetAllUsersOutputDto } from './dto/GetAllUsersOutput.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<ResponseMsgDto> {
    return this.usersService.createUser(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('subordinates')
  async getAllSubordinates(
    @Req() req: any
  ): Promise<SubordinatesOutputDto[] | GetAllUsersOutputDto> {
    return this.usersService.getSubordinatesOfUser(req.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('assignBoss')
  async assignBoss(
    @Body() body: AssignBossDto,
    @Req() req: any
  ): Promise<ResponseMsgDto> {
    return this.usersService.assignBossToUser(body, req.userId)
  }
}
