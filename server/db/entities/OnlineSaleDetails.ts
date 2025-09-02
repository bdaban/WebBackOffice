import 'reflect-metadata'
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_dbo.OnlineSaleDetails", ["id"], { unique: true })
@Entity("OnlineSaleDetails", { schema: "dbo" })
export class OnlineSaleDetails {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("datetime", { name: "DateTime" })
  dateTime: Date;

  @Column("nvarchar", { name: "ReceiptNr", nullable: true, length: 20 })
  receiptNr: string | null;

  @Column("nchar", { name: "FuelType", length: 50 })
  fuelType: string;

  @Column("float", { name: "UnitPrice", precision: 53 })
  unitPrice: number;

  @Column("decimal", { name: "Amount", precision: 8, scale: 2 })
  amount: number;

  @Column("float", { name: "Total", precision: 53 })
  total: number;

  @Column("int", { name: "PumpNr" })
  pumpNr: number;

  @Column("nvarchar", { name: "ECRPlate", nullable: true, length: 12 })
  ecrPlate: string | null;

  @Column("nvarchar", { name: "LoyaltyCardNo", nullable: true, length: 24 })
  loyaltyCardNo: string | null;

  @Column("float", { name: "FullUnitPrice", precision: 53 })
  fullUnitPrice: number;

  @Column("nvarchar", { name: "FleetCode", nullable: true, length: 12 })
  fleetCode: string | null;

  @Column("nvarchar", { name: "FleetName", nullable: true, length: 12 })
  fleetName: string | null;

  @Column("nvarchar", { name: "TagNr", nullable: true, length: 24 })
  tagNr: string | null;

  @Column("nvarchar", { name: "Plate", nullable: true, length: 12 })
  plate: string | null;

  @Column("bit", { name: "SubeKodu", nullable: true })
  subeKodu: boolean | null;

  @Column("nvarchar", { name: "LoyaltyCardType", nullable: true, length: 12 })
  loyaltyCardType: string | null;
}
