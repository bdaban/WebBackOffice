import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const { from, to } = getRangeFromQuery(q, 7)
  const vardiyaNo = String(q.vardiyaNo || '').trim()

  const ds = await getDataSource()

  const qb = ds
    .createQueryBuilder()
    .from('dbo.VardiyaSaleDetails', 's')
    .where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })
  if (vardiyaNo) qb.andWhere('s.VardiyaNo = :vardiyaNo', { vardiyaNo })

  const rows = await qb
    .select('s.PumpNr', 'pumpNr')
    .addSelect('SUM(s.Total)', 'total')
    .addSelect('SUM(s.Amount)', 'amount')
    .groupBy('s.PumpNr')
    .orderBy('total', 'DESC')
    .getRawMany<{ pumpNr: number; total: string; amount: string }>()

  return rows.map(r => ({ pumpNr: r.pumpNr, total: Number(r.total || 0), amount: Number(r.amount || 0) }))
})


