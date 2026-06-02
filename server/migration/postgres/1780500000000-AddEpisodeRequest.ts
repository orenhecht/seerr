import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEpisodeRequest1780500000000 implements MigrationInterface {
  name = 'AddEpisodeRequest1780500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "episode_request" ("id" SERIAL NOT NULL, "seasonNumber" integer NOT NULL, "episodeNumber" integer NOT NULL, "status" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "requestId" integer, CONSTRAINT "PK_5f73107f096fbc434fb51f320e7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54bc06f2d789a48d779033e9f5" ON "episode_request" ("requestId")`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5868e1b89dde698abf7a29931b" ON "episode_request" ("requestId", "seasonNumber", "episodeNumber")`
    );
    await queryRunner.query(
      `ALTER TABLE "episode_request" ADD CONSTRAINT "FK_54bc06f2d789a48d779033e9f5e" FOREIGN KEY ("requestId") REFERENCES "media_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode_request" DROP CONSTRAINT "FK_54bc06f2d789a48d779033e9f5e"`
    );
    await queryRunner.query(`DROP INDEX "IDX_5868e1b89dde698abf7a29931b"`);
    await queryRunner.query(`DROP INDEX "IDX_54bc06f2d789a48d779033e9f5"`);
    await queryRunner.query(`DROP TABLE "episode_request"`);
  }
}
