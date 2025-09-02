import 'reflect-metadata'
import { Column, Entity } from "typeorm";

@Entity("tts", { schema: "dbo" })
export class Tts {
  @Column("nvarchar", { name: "Müşteri Kodu", nullable: true, length: 255 })
  mTeriKodu: string | null;

  @Column("nvarchar", { name: "Müşteri Adı", nullable: true, length: 255 })
  mTeriAd: string | null;

  @Column("nvarchar", { name: "Departman", nullable: true, length: 255 })
  departman: string | null;

  @Column("nvarchar", { name: "Plaka", nullable: true, length: 255 })
  plaka: string | null;

  @Column("datetime", { name: "İşlem Tarihi", nullable: true })
  lemTarihi: Date | null;

  @Column("nvarchar", { name: "İşlem Tipi", nullable: true, length: 255 })
  lemTipi: string | null;

  @Column("nvarchar", { name: "İstasyon", nullable: true, length: 255 })
  stasyon: string | null;

  @Column("nvarchar", { name: "İstasyon İli", nullable: true, length: 255 })
  stasyonLi: string | null;

  @Column("nvarchar", { name: "Ürün", nullable: true, length: 255 })
  rN: string | null;

  @Column("float", { name: "Arac Km", nullable: true, precision: 53 })
  aracKm: number | null;

  @Column("float", { name: "Birim Fiyat", nullable: true, precision: 53 })
  birimFiyat: number | null;

  @Column("float", { name: "Miktar", nullable: true, precision: 53 })
  miktar: number | null;

  @Column("float", { name: "Tutar", nullable: true, precision: 53 })
  tutar: number | null;
}
