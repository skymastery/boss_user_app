import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  passwordHashed: string

  @Column({ default: null })
  passwordSalt: string

  @Column({ default: null })
  boss: number

  @Column({ default: false })
  isAdmin: boolean
}
