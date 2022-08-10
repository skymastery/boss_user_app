import { IsNotEmpty, IsString } from 'class-validator'

export class AssignBossDto {
  @IsString()
  @IsNotEmpty()
  futureBossId: string

  @IsString()
  @IsNotEmpty()
  futureSubordinateId: string
}
