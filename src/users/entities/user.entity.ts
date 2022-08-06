import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  passwordSalt: string;

  @ManyToOne(() => User, (user) => user.bossOf)
  subordinateOf: User;

  @OneToMany(() => User, (user) => user.subordinateOf)
  bossOf: User[];

  @Column({ default: true })
  isAdmin: boolean;
}
