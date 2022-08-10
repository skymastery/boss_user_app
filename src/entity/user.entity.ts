import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  passwordHashed: string

  @Column({ default: null })
  passwordSalt: string

  @Column({ default: null })
  boss: string

  @Column({ default: false })
  isAdmin: boolean
}
