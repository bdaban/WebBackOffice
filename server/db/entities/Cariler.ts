import 'reflect-metadata'
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_dbo.Cariler", ["id"], { unique: true })
@Entity("Cariler", { schema: "dbo" })
export class Cariler {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("nvarchar", { name: "CariKodu", nullable: true, length: 30 })
  cariKodu: string | null;

  @Column("nvarchar", { name: "NetsisKodu", nullable: true, length: 30 })
  netsisKodu: string | null;

  @Column("nvarchar", { name: "NetsisGrupKodu", nullable: true, length: 20 })
  netsisGrupKodu: string | null;

  @Column("nvarchar", { name: "CariAdi", nullable: true, length: 200 })
  cariAdi: string | null;

  @Column("nvarchar", { name: "MusteriKategory", nullable: true })
  musteriKategory: string | null;

  @Column("nvarchar", { name: "Adres", nullable: true, length: 200 })
  adres: string | null;

  @Column("nvarchar", { name: "Ilce", nullable: true, length: 30 })
  ilce: string | null;

  @Column("nvarchar", { name: "Il", nullable: true, length: 30 })
  il: string | null;

  @Column("nvarchar", { name: "VergiDairesi", nullable: true, length: 50 })
  vergiDairesi: string | null;

  @Column("nvarchar", { name: "VergiTcNo", nullable: true, length: 11 })
  vergiTcNo: string | null;

  @Column("nvarchar", { name: "Telefon", nullable: true, length: 15 })
  telefon: string | null;

  @Column("nvarchar", { name: "Email", nullable: true, length: 200 })
  email: string | null;

  @Column("bit", { name: "Durumu" })
  durumu: boolean;

  @Column("nvarchar", { name: "OdemeSekli", nullable: true, length: 20 })
  odemeSekli: string | null;

  @Column("decimal", { name: "IndirimYuzdesi", precision: 4, scale: 2 })
  indirimYuzdesi: number;

  @Column("nvarchar", { name: "YakitTipi", nullable: true, length: 15 })
  yakitTipi: string | null;

  @Column("decimal", { name: "Limit", precision: 12, scale: 2 })
  limit: number;

  @Column("bit", { name: "SmsCheck", nullable: true })
  smsCheck: boolean | null;

  @Column("nvarchar", { name: "UlkeKod", nullable: true, length: 2 })
  ulkeKod: string | null;

  @Column("nvarchar", { name: "SmsTelNo", nullable: true, length: 50 })
  smsTelNo: string | null;

  @Column("nvarchar", { name: "PortalUserName", nullable: true, length: 12 })
  portalUserName: string | null;

  @Column("nvarchar", { name: "PortalSifre", nullable: true, length: 12 })
  portalSifre: string | null;

  @Column("nvarchar", {
    name: "TahsilatOdemeSekli",
    nullable: true,
    length: 30,
  })
  tahsilatOdemeSekli: string | null;
}
