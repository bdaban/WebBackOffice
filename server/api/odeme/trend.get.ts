import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const { from, to } = getRangeFromQuery(q, 30)

  const ds = await getDataSource()
  const rows = await ds.createQueryBuilder()
    .from('dbo.TahsilatTablosu', 't')
    .where('t.Tarih >= :from AND t.Tarih < DATEADD(day, 1, :to)', { from, to })
    .select("CONVERT(date, t.Tarih)", 'date')
    .addSelect('t.OdemeSekli', 'odeme')
    .addSelect('SUM(t.NetTutar)', 'total')
    .groupBy("CONVERT(date, t.Tarih)")
    .addGroupBy('t.OdemeSekli')
    .orderBy('date', 'ASC')
    .getRawMany<{ date: string; odeme: string; total: string }>()

  return rows.map(r => ({ date: r.date, odeme: r.odeme, total: Number(r.total || 0) }))
})


