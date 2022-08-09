import { Exclude } from 'class-transformer'
import { User } from '../../entity/user.entity'

export class UserOutputDto {
  username: string

  isAdmin: boolean

  subordinateUsers?: User

  boss?: User

  @Exclude()
  passwordHashed: string

  @Exclude()
  passwordSalt: string
  constructor(partial: Partial<UserOutputDto>) {
    Object.assign(this, partial)
  }
}
