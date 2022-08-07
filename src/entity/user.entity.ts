import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'

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

  @ManyToOne(() => User, (user) => user.id)
  subordinateOf: User

  @OneToMany(() => User, (user) => user.id)
  bossOf: User[]

  @Column({ default: false })
  isAdmin: boolean
}
