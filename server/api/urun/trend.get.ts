import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const { from, to } = getRangeFromQuery(q, 30)

  const ds = await getDataSource()
  const rows = await ds.createQueryBuilder()
    .from('dbo.VardiyaSaleDetails', 's')
    .where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })
    .select("CONVERT(date, s.DateTime)", 'date')
    .addSelect('s.FuelType', 'fuelType')
    .addSelect('SUM(s.Total)', 'total')
    .groupBy("CONVERT(date, s.DateTime)")
    .addGroupBy('s.FuelType')
    .orderBy('date', 'ASC')
    .getRawMany<{ date: string; fuelType: string; total: string }>()

  return rows.map(r => ({ date: r.date, fuelType: r.fuelType, total: Number(r.total || 0) }))
})


