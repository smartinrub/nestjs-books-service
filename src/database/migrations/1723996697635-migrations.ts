import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1723996697635 implements MigrationInterface {
    name = 'Migrations1723996697635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "book" ("isbn" character varying NOT NULL, "title" character varying NOT NULL, "author" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_bd183604b9c828c0bdd92cafab7" PRIMARY KEY ("isbn"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "book"`);
    }

}
