import 'reflect-metadata'
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_dbo.PlakaCihazlar", ["id"], { unique: true })
@Entity("PlakaCihazlar", { schema: "dbo" })
export class PlakaCihazlar {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("nvarchar", { name: "Plaka", nullable: true, length: 20 })
  plaka: string | null;

  @Column("nvarchar", { name: "CihazNo", nullable: true, length: 50 })
  cihazNo: string | null;

  @Column("nvarchar", { name: "CariKod", nullable: true, length: 30 })
  cariKod: string | null;

  @Column("int", { name: "CariId" })
  cariId: number;

  @Column("nchar", { name: "YakitTipi", nullable: true, length: 50 })
  yakitTipi: string | null;

  @Column("nvarchar", { name: "PlOdemeSekli", nullable: true, length: 20 })
  plOdemeSekli: string | null;
}
