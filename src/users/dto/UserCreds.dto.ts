import { IsDefined, IsString, MinLength } from 'class-validator'

export class UserCredsDto {
  @IsDefined()
  @IsString()
  username: string

  @IsDefined()
  @IsString()
  @MinLength(6)
  password: string
}
