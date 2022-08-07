import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UserOutputDto {
  @IsString()
  username: string

  @IsBoolean()
  isAdmin: boolean

  @IsOptional()
  subordinateOfId?: any

  @IsOptional()
  bossOf?: any
}
