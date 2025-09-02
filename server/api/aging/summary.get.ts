import { getDataSource } from '../../db/data-source'

export default defineEventHandler(async () => {
  // Basit yaşlandırma: CariHareketler tarihine göre 30 günlük kovalar
  const ds = await getDataSource()
  const rows = await ds.createQueryBuilder()
    .from('dbo.CariHareketler', 'c')
    .where('c.Tarih IS NOT NULL')
    .select("SUM(CASE WHEN DATEDIFF(day, c.Tarih, GETDATE()) <= 30 THEN c.NetTutar ELSE 0 END)", 'd0_30')
    .addSelect("SUM(CASE WHEN DATEDIFF(day, c.Tarih, GETDATE()) BETWEEN 31 AND 60 THEN c.NetTutar ELSE 0 END)", 'd31_60')
    .addSelect("SUM(CASE WHEN DATEDIFF(day, c.Tarih, GETDATE()) BETWEEN 61 AND 90 THEN c.NetTutar ELSE 0 END)", 'd61_90')
    .addSelect("SUM(CASE WHEN DATEDIFF(day, c.Tarih, GETDATE()) > 90 THEN c.NetTutar ELSE 0 END)", 'd90p')
    .getRawOne<{ d0_30: string; d31_60: string; d61_90: string; d90p: string }>()

  return {
    d0_30: Number(rows?.d0_30 || 0),
    d31_60: Number(rows?.d31_60 || 0),
    d61_90: Number(rows?.d61_90 || 0),
    d90p: Number(rows?.d90p || 0),
  }
})


