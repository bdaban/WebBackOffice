import 'reflect-metadata'
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_dbo.TankDetails", ["id"], { unique: true })
@Entity("TankDetails", { schema: "dbo" })
export class TankDetails {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("datetime", { name: "DateTime" })
  dateTime: Date;

  @Column("nvarchar", { name: "TankNo", nullable: true, length: 10 })
  tankNo: string | null;

  @Column("nvarchar", { name: "TankName", nullable: true, length: 10 })
  tankName: string | null;

  @Column("nvarchar", { name: "FuelType", nullable: true, length: 20 })
  fuelType: string | null;

  @Column("nvarchar", { name: "PmpFuelType", nullable: true, length: 30 })
  pmpFuelType: string | null;

  @Column("nvarchar", { name: "CurrentVolume", nullable: true, length: 30 })
  currentVolume: string | null;

  @Column("nvarchar", { name: "PreviousVolume", nullable: true, length: 30 })
  previousVolume: string | null;

  @Column("nvarchar", { name: "SatisDelta", nullable: true, length: 30 })
  satisDelta: string | null;

  @Column("nvarchar", { name: "DeliveryVolume", nullable: true, length: 30 })
  deliveryVolume: string | null;

  @Column("nvarchar", { name: "VardiyaNo", nullable: true, length: 4 })
  vardiyaNo: string | null;

  @Column("bit", { name: "SubeKodu", default: () => "(0)" })
  subeKodu: boolean;
}
