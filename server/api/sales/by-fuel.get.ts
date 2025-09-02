import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const { from, to } = getRangeFromQuery(query, 30)

	const ds = await getDataSource()

	const qb = ds
		.createQueryBuilder()
		.from('dbo.VardiyaSaleDetails', 's')
		.where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })
		.select('s.FuelType', 'fuelType')
		.addSelect('SUM(s.Total)', 'total')
		.groupBy('s.FuelType')
		.orderBy('total', 'DESC')

	const rows = await qb.getRawMany<{ fuelType: number; total: string }>()
	return rows.map(r => ({ fuelType: r.fuelType, total: Number(r.total || 0) }))
})


