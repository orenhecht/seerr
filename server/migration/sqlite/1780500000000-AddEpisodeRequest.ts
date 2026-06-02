import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEpisodeRequest1780500000000 implements MigrationInterface {
  name = 'AddEpisodeRequest1780500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "episode_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "seasonNumber" integer NOT NULL, "episodeNumber" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "requestId" integer)`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54bc06f2d789a48d779033e9f5" ON "episode_request" ("requestId")`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5868e1b89dde698abf7a29931b" ON "episode_request" ("requestId", "seasonNumber", "episodeNumber")`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_episode_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "seasonNumber" integer NOT NULL, "episodeNumber" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "requestId" integer, CONSTRAINT "FK_54bc06f2d789a48d779033e9f5e" FOREIGN KEY ("requestId") REFERENCES "media_request" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_episode_request"("id", "seasonNumber", "episodeNumber", "status", "createdAt", "updatedAt", "requestId") SELECT "id", "seasonNumber", "episodeNumber", "status", "createdAt", "updatedAt", "requestId" FROM "episode_request"`
    );
    await queryRunner.query(`DROP TABLE "episode_request"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_episode_request" RENAME TO "episode_request"`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54bc06f2d789a48d779033e9f5" ON "episode_request" ("requestId")`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5868e1b89dde698abf7a29931b" ON "episode_request" ("requestId", "seasonNumber", "episodeNumber")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_5868e1b89dde698abf7a29931b"`);
    await queryRunner.query(`DROP INDEX "IDX_54bc06f2d789a48d779033e9f5"`);
    await queryRunner.query(`DROP TABLE "episode_request"`);
  }
}
