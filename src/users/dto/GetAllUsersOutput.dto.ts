import { UserOutputDto } from './UserOutput.dto'
import { IsNumber } from 'class-validator'

export class GetAllUsersOutputDto {
  @IsNumber()
  quantity: number

  allUsers: UserOutputDto[]
}
