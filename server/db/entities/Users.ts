import 'reflect-metadata'
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_dbo.Users", ["id"], { unique: true })
@Entity("Users", { schema: "dbo" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("nvarchar", { name: "KullaniciAdi", nullable: true, length: 20 })
  kullaniciAdi: string | null;

  @Column("nvarchar", { name: "Adi", nullable: true, length: 20 })
  adi: string | null;

  @Column("nvarchar", { name: "Soyadi", nullable: true, length: 20 })
  soyadi: string | null;

  @Column("nvarchar", { name: "Gorevi", nullable: true, length: 20 })
  gorevi: string | null;

  @Column("nvarchar", { name: "Parola", nullable: true, length: 32 })
  parola: string | null;

  @Column("nvarchar", { name: "HatirlatmaSorusu", nullable: true, length: 50 })
  hatirlatmaSorusu: string | null;

  @Column("nvarchar", { name: "Cevap", nullable: true, length: 20 })
  cevap: string | null;

  @Column("datetime", { name: "KayitTarihi", nullable: true })
  kayitTarihi: Date | null;

  @Column("datetime", { name: "SonGirisTarihi", nullable: true })
  sonGirisTarihi: Date | null;
}
