import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const { from, to } = getRangeFromQuery(q, 7)

  const ds = await getDataSource()

  const rows = await ds
    .createQueryBuilder()
    .from('dbo.VardiyaSaleDetails', 's')
    .where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })
    .select('s.VardiyaNo', 'vardiyaNo')
    .addSelect('SUM(s.Total)', 'total')
    .addSelect('SUM(s.Amount)', 'amount')
    .groupBy('s.VardiyaNo')
    .orderBy('total', 'DESC')
    .getRawMany<{ vardiyaNo: string; total: string; amount: string }>()

  return rows.map(r => {
    const total = Number(r.total || 0)
    const amount = Number(r.amount || 0)
    return {
      vardiyaNo: r.vardiyaNo,
      total,
      amount,
      avgUnitPriceWeighted: amount > 0 ? total / amount : 0,
    }
  })
})


