import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const { from, to } = getRangeFromQuery(q, 30)

  const ds = await getDataSource()
  const rows = await ds.createQueryBuilder()
    .from('dbo.VardiyaSaleDetails', 's')
    .where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })
    .select('DATEPART(weekday, s.DateTime)', 'dow')
    .addSelect('DATEPART(hour, s.DateTime)', 'hour')
    .addSelect('SUM(s.Total)', 'total')
    .groupBy('DATEPART(weekday, s.DateTime)')
    .addGroupBy('DATEPART(hour, s.DateTime)')
    .getRawMany<{ dow: number; hour: number; total: string }>()

  return rows.map(r => ({ dow: Number(r.dow), hour: Number(r.hour), total: Number(r.total || 0) }))
})


