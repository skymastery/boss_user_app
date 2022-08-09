import { IsNotEmpty } from 'class-validator'

export class ResponseMsgDto {
  @IsNotEmpty()
  msg: string
}
