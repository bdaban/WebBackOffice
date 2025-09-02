import 'reflect-metadata'
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_dbo.CariHareketler", ["id"], { unique: true })
@Entity("CariHareketler", { schema: "dbo" })
export class CariHareketler {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("nvarchar", { name: "FisNo", nullable: true, length: 20 })
  fisNo: string | null;

  @Column("int", { name: "CariId" })
  cariId: number;

  @Column("nvarchar", { name: "CariKodu", nullable: true })
  cariKodu: string | null;

  @Column("nvarchar", { name: "NetsisKodu", nullable: true, length: 20 })
  netsisKodu: string | null;

  @Column("bit", { name: "NetIrsDurumu" })
  netIrsDurumu: boolean;

  @Column("datetime", { name: "Tarih", nullable: true })
  tarih: Date | null;

  @Column("datetime", { name: "Saat", nullable: true })
  saat: Date | null;

  @Column("nvarchar", { name: "CihazNo", nullable: true, length: 30 })
  cihazNo: string | null;

  @Column("nvarchar", { name: "OdemeSekli", nullable: true, length: 20 })
  odemeSekli: string | null;

  @Column("nvarchar", { name: "Plaka", nullable: true, length: 30 })
  plaka: string | null;

  @Column("nvarchar", { name: "YakitAdi", nullable: true, length: 50 })
  yakitAdi: string | null;

  @Column("decimal", { name: "Fiyat", precision: 12, scale: 6 })
  fiyat: number;

  @Column("decimal", { name: "Miktar", precision: 12, scale: 2 })
  miktar: number;

  @Column("float", { name: "NetTutar", precision: 53 })
  netTutar: number;

  @Column("decimal", {
    name: "IndirimYuzdesi",
    nullable: true,
    precision: 4,
    scale: 2,
  })
  indirimYuzdesi: number | null;

  @Column("bit", { name: "KasaDurumu", default: () => "(0)" })
  kasaDurumu: boolean;

  @Column("nvarchar", { name: "CarAdSoyad", nullable: true, length: 50 })
  carAdSoyad: string | null;

  @Column("bit", { name: "SubeKodu", default: () => "(0)" })
  subeKodu: boolean;
}
