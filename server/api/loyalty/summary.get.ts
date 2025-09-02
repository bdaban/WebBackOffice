import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const { from, to } = getRangeFromQuery(q, 30)

  const ds = await getDataSource()
  const rows = await ds.createQueryBuilder()
    .from('dbo.VardiyaSaleDetails', 's')
    .where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })
    .andWhere('(s.FleetCode IS NOT NULL OR s.TagNr IS NOT NULL OR s.LoyaltyCardNo IS NOT NULL)')
    .select('COALESCE(NULLIF(LTRIM(RTRIM(s.FleetCode)), \'\'), NULLIF(LTRIM(RTRIM(s.TagNr)), \'\'), NULLIF(LTRIM(RTRIM(s.LoyaltyCardNo)), \'\'), \'Diğer\')', 'key')
    .addSelect('ISNULL(NULLIF(LTRIM(RTRIM(s.FleetName)), \'\'), \'\')', 'name')
    .addSelect('SUM(s.Total)', 'total')
    .groupBy('COALESCE(NULLIF(LTRIM(RTRIM(s.FleetCode)), \'\'), NULLIF(LTRIM(RTRIM(s.TagNr)), \'\'), NULLIF(LTRIM(RTRIM(s.LoyaltyCardNo)), \'\'), \'Diğer\')')
    .addGroupBy('ISNULL(NULLIF(LTRIM(RTRIM(s.FleetName)), \'\'), \'\')')
    .orderBy('total', 'DESC')
    .getRawMany<{ key: string; name: string; total: string }>()

  return rows.map(r => ({ key: r.key, name: r.name, total: Number(r.total || 0) }))
})


