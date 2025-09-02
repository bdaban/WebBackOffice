import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const { from, to } = getRangeFromQuery(q, 30)
  const plate = String(q.plate || '').trim()
  const top = Math.min(100, Math.max(1, Number(q.top || 20)))

  const ds = await getDataSource()
  const qb = ds
    .createQueryBuilder()
    .from('dbo.VardiyaSaleDetails', 's')
    .where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })
    .andWhere("s.Plate IS NOT NULL AND LTRIM(RTRIM(s.Plate)) <> ''")
  if (plate) qb.andWhere('s.Plate LIKE :p', { p: `%${plate}%` })

  const rows = await qb
    .select('s.Plate', 'plate')
    .addSelect('COUNT(1)', 'tx')
    .addSelect('SUM(s.Amount)', 'amount')
    .addSelect('SUM(s.Total)', 'total')
    .groupBy('s.Plate')
    .orderBy('total', 'DESC')
    .limit(top)
    .getRawMany<{ plate: string; tx: string; amount: string; total: string }>()

  return rows.map(r => ({ plate: r.plate, tx: Number(r.tx||0), amount: Number(r.amount||0), total: Number(r.total||0) }))
})


