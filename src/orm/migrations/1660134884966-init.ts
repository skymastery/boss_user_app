import { MigrationInterface, QueryRunner } from 'typeorm'

export class init1660134884966 implements MigrationInterface {
  name = 'init1660134884966'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "passwordHashed" character varying NOT NULL, "passwordSalt" character varying, "boss" character varying, "isAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`)
  }
}
