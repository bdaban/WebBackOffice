import 'reflect-metadata'
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_dbo.TahsilatTablosu", ["id"], { unique: true })
@Entity("TahsilatTablosu", { schema: "dbo" })
export class TahsilatTablosu {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "CariId" })
  cariId: number;

  @Column("nvarchar", { name: "CariKodu", nullable: true, length: 30 })
  cariKodu: string | null;

  @Column("nvarchar", { name: "NetsisKodu", nullable: true, length: 30 })
  netsisKodu: string | null;

  @Column("nvarchar", { name: "CariAdi", nullable: true, length: 200 })
  cariAdi: string | null;

  @Column("datetime", { name: "Tarih" })
  tarih: Date;

  @Column("datetime", { name: "Saat" })
  saat: Date;

  @Column("nvarchar", { name: "YakitAdi", nullable: true, length: 30 })
  yakitAdi: string | null;

  @Column("nvarchar", { name: "FisNo", nullable: true, length: 20 })
  fisNo: string | null;

  @Column("decimal", { name: "Miktar", precision: 12, scale: 2 })
  miktar: number;

  @Column("float", { name: "BFiyat", precision: 53 })
  bFiyat: number;

  @Column("float", { name: "Tutar", precision: 53 })
  tutar: number;

  @Column("float", { name: "NetTutar", precision: 53 })
  netTutar: number;

  @Column("nvarchar", { name: "Plaka", nullable: true, length: 20 })
  plaka: string | null;

  @Column("decimal", { name: "indirimyuzdesi", precision: 4, scale: 2 })
  indirimyuzdesi: number;

  @Column("bit", { name: "KasaDurumu" })
  kasaDurumu: boolean;

  @Column("bit", { name: "SubeKodu" })
  subeKodu: boolean;

  @Column("nvarchar", { name: "OdemeSekli", nullable: true })
  odemeSekli: string | null;
}
