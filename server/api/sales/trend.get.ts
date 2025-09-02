import { getDataSource } from '../../db/data-source'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const { from, to } = getRangeFromQuery(query, 30)
  let group = String(query.group || 'day') as 'day' | 'week' | 'month' | 'quarter' | 'year'
  if ('month' in query) group = 'month'
  else if ('week' in query) group = 'week'
  else if ('year' in query) group = 'year'

	const ds = await getDataSource()

	// MSSQL group bucket expression by selected granularity
	let bucketExpr = "CONVERT(date, s.DateTime)"
	let orderExpr = 'bucket'
	if (group === 'week') {
		bucketExpr = "CONVERT(date, DATEADD(week, DATEDIFF(week, 0, s.DateTime), 0))"
		orderExpr = 'bucket'
	} else if (group === 'month') {
		bucketExpr = "CONVERT(date, DATEFROMPARTS(YEAR(s.DateTime), MONTH(s.DateTime), 1))"
		orderExpr = 'bucket'
	} else if (group === 'quarter') {
		bucketExpr = "CONCAT(CAST(YEAR(s.DateTime) as varchar(4)), '-Q', CAST(DATEPART(quarter, s.DateTime) as varchar(1)))"
		orderExpr = "MIN(CONVERT(date, DATEFROMPARTS(YEAR(s.DateTime), ((DATEPART(quarter, s.DateTime)-1)*3)+1, 1)))"
	} else if (group === 'year') {
		bucketExpr = "CAST(YEAR(s.DateTime) as varchar(4))"
		orderExpr = "MIN(CONVERT(date, DATEFROMPARTS(YEAR(s.DateTime), 1, 1)))"
	}

	const qb = ds
		.createQueryBuilder()
		.from('dbo.VardiyaSaleDetails', 's')
		.where('s.DateTime >= :from AND s.DateTime < DATEADD(day, 1, :to)', { from, to })
		.select(bucketExpr, 'bucket')
		.addSelect('SUM(s.Total)', 'total')
		.addSelect('SUM(s.Amount)', 'amount')
		.groupBy(bucketExpr)
		.orderBy(orderExpr, 'ASC')

	const rows = await qb.getRawMany<{ bucket: string; total: string; amount: string }>()

	return rows.map(r => ({
		date: r.bucket,
		total: Number(r.total || 0),
		amount: Number(r.amount || 0)
	}))
})


