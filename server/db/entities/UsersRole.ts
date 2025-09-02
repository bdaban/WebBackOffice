import 'reflect-metadata'
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_dbo.UsersRole", ["id"], { unique: true })
@Entity("UsersRole", { schema: "dbo" })
export class UsersRole {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "RootId" })
  rootId: number;

  @Column("int", { name: "ParentId" })
  parentId: number;

  @Column("nvarchar", { name: "KullaniciAd", nullable: true, length: 20 })
  kullaniciAd: string | null;

  @Column("nvarchar", { name: "FormAdi", nullable: true, length: 38 })
  formAdi: string | null;

  @Column("nvarchar", { name: "KontrolAdi", nullable: true, length: 30 })
  kontrolAdi: string | null;

  @Column("bit", { name: "Yetki" })
  yetki: boolean;
}
