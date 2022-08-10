import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SubordinatesOutputDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  username: string

  @IsOptional()
  @IsString()
  boss: string | null

  @IsOptional()
  @IsString()
  boss_name: string | null
}
