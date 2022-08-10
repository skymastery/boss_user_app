import { UserOutputDto } from '../../users/dto/UserOutput.dto'

export class TokenOutputDto {
  user: UserOutputDto

  auth: { accessToken: string }
}
