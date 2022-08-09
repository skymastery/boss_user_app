import { IsNotEmpty, IsNumber } from 'class-validator'

export class AssignBossDto {
  @IsNumber()
  @IsNotEmpty()
  futureBossId: number

  @IsNumber()
  @IsNotEmpty()
  futureSubordinateId: number
}
