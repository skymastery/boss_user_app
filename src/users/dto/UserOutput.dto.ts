import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UserOutputDto {
  @IsNotEmpty()
  id: number

  @IsString()
  username: string

  @IsOptional()
  @IsString()
  boss: number | null

  @IsBoolean()
  isAdmin: boolean
}
