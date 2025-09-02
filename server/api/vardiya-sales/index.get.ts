import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const { from, to } = getRangeFromQuery(q, 7)
  const page = Math.max(1, Number(q.page || 1))
  const pageSize = Math.min(100, Math.max(1, Number(q.pageSize || 50)))
  const vardiyaNo = String(q.vardiyaNo || '').trim()

  const ds = await getDataSource()
  const base = ds
    .createQueryBuilder()
    .from('dbo.VardiyaSaleDetails', 's')
    .where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })

  if (vardiyaNo) base.andWhere('s.VardiyaNo = :vardiyaNo', { vardiyaNo })

  const rowsPromise = base
    .select([
      's.DateTime AS dateTime',
      's.ReceiptNr AS receiptNr',
      's.FuelType AS fuelType',
      's.Amount AS amount',
      's.Total AS total',
      's.PumpNr AS pumpNr',
      's.Plate AS plate',
      's.FleetName AS fleetName',
      's.FleetCode AS fleetCode',
      's.TagNr AS tagNr',
      's.LoyaltyCardNo AS loyaltyCardNo',
      's.VardiyaNo AS vardiyaNo',
    ])
    .orderBy('s.DateTime', 'DESC')
    .offset((page - 1) * pageSize)
    .limit(pageSize)
    .getRawMany()

  const countBase = ds
    .createQueryBuilder()
    .from('dbo.VardiyaSaleDetails', 's')
    .where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })
  if (vardiyaNo) countBase.andWhere('s.VardiyaNo = :vardiyaNo', { vardiyaNo })
  const totalPromise = countBase.getCount()

  const [rows, total] = await Promise.all([rowsPromise, totalPromise])
  return { data: rows, pagination: { page, pageSize, total } }
})


