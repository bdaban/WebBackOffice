import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const { from, to } = getRangeFromQuery(q, 7)

  const ds = await getDataSource()
  const rows = await ds.createQueryBuilder()
    .from('dbo.TankDetails', 't')
    .where('t.DateTime >= :from AND t.DateTime < DATEADD(day, 1, :to)', { from, to })
    .select('t.TankName', 'tank')
    .addSelect('MIN(TRY_CAST(t.CurrentVolume as float))', 'minVol')
    .addSelect('MAX(TRY_CAST(t.CurrentVolume as float))', 'maxVol')
    .addSelect('SUM(TRY_CAST(t.DeliveryVolume as float))', 'delivery')
    .groupBy('t.TankName')
    .getRawMany<{ tank: string; minVol: string; maxVol: string; delivery: string }>()

  return rows.map(r => ({ tank: r.tank, minVol: Number(r.minVol||0), maxVol: Number(r.maxVol||0), delivery: Number(r.delivery||0) }))
})


