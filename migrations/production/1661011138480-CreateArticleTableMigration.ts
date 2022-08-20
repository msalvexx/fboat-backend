import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateArticleTableMigration1661011138480 implements MigrationInterface {
  private readonly create: string = `
    CREATE TABLE artigos (
    id_artigo varchar(255) UNIQUE NOT NULL,
    id_conta varchar(255),
    slug varchar(255) UNIQUE NOT NULL,
    titulo varchar(255) NOT NULL,
    foto varchar(255) NOT NULL,
    resumo text NOT NULL,
    conteudo mediumtext NOT NULL,
    publicado tinyint(1) NOT NULL DEFAULT 0,
    revisado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    publicado_em DATETIME,
    PRIMARY KEY (id_artigo),
    FOREIGN KEY (id_conta) REFERENCES contas(id_conta)
  )`
  private readonly createIndex: string = 'CREATE UNIQUE INDEX slug_idx ON artigos(slug)'
  private readonly drop: string = 'DROP table artigos'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(this.create)
    await queryRunner.query(this.createIndex)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(this.drop)
  }
}
