import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UserOutputDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsString()
  username: string

  @IsOptional()
  @IsString()
  boss: string | null
}
