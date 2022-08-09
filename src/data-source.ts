import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/user.entity'
import { config } from 'dotenv'
config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
})
