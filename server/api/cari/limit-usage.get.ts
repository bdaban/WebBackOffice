import { getDataSource } from '../../db/data-source'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const top = Math.min(200, Math.max(1, Number(q.top || 50)))

  const ds = await getDataSource()

  // Cari tüketimini yaklaşık olarak plaka/cari eşleşmesi olmadan hesaplamak zor olabilir.
  // Basit yaklaşım: Cariler.limit ve indirim ile birlikte cari adına göre son tüketim (VardiyaSaleDetails Plate eşleşmesi yoksa 0) yerine placeholder 0 kullanılır.
  // Geliştirme: PlakaCihazlar üzerinden Cariler'e bağlayıp Plate -> CariId eşleşmesi ile VardiyaSaleDetails toplamlarını bulmak.

  const rows = await ds.createQueryBuilder()
    .from('dbo.Cariler', 'c')
    .leftJoin('dbo.PlakaCihazlar', 'p', 'p.CariId = c.Id OR p.CariKod = c.CariKodu')
    .leftJoin('dbo.VardiyaSaleDetails', 's', 's.Plate = p.Plaka')
    .select('c.Id', 'id')
    .addSelect('c.CariKodu', 'cariKodu')
    .addSelect('c.CariAdi', 'cariAdi')
    .addSelect('c.[Limit]', 'limit')
    .addSelect('c.IndirimYuzdesi', 'indirim')
    .addSelect('SUM(s.Total)', 'tuketim')
    .groupBy('c.Id')
    .addGroupBy('c.CariKodu')
    .addGroupBy('c.CariAdi')
    .addGroupBy('c.[Limit]')
    .addGroupBy('c.IndirimYuzdesi')
    .orderBy('tuketim', 'DESC')
    .limit(top)
    .getRawMany<{ id: number; cariKodu: string; cariAdi: string; limit: string; indirim: string; tuketim: string }>()

  return rows.map(r => {
    const limit = Number(r.limit || 0)
    const tuketim = Number(r.tuketim || 0)
    const doluluk = limit > 0 ? (tuketim / limit) : 0
    return { id: r.id, cariKodu: r.cariKodu, cariAdi: r.cariAdi, limit, indirim: Number(r.indirim||0), tuketim, doluluk }
  })
})


