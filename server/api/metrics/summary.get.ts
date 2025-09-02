import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const { from, to } = getRangeFromQuery(query, 30)

	const ds = await getDataSource()

	// Aggregate totals (raw table via QB)
	const qb = ds
		.createQueryBuilder()
		.from('dbo.VardiyaSaleDetails', 's')
		.where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })
		.select('SUM(s.Total)', 'totalSales')
		.addSelect('SUM(s.Amount)', 'totalVolume')
		.addSelect('COUNT(1)', 'transactions')

	const raw = await qb.getRawOne<{ totalSales: string; totalVolume: string; transactions: string }>()

	const totalSales = Number(raw?.totalSales || 0)
	const totalVolume = Number(raw?.totalVolume || 0)
	const transactions = Number(raw?.transactions || 0)
	const avgUnitPriceWeighted = totalVolume > 0 ? totalSales / totalVolume : 0

	return {
		totalSales,
		totalVolume,
		avgUnitPriceWeighted,
		transactions,
	}
})


