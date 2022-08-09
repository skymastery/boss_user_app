import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'
config()

export const connectionSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: false,
  name: 'default',
  entities: ['src/entity/*.entity{.ts,.js}'],
  migrations: ['src/orm/migrations/*{.ts,.js}'],
  subscribers: ['src/subscriber/**/*{.ts,.js}'],
})
