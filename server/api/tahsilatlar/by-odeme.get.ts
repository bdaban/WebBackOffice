import { getDataSource } from '../../db/data-source'
import { TahsilatTablosu } from '../../db/entities/TahsilatTablosu'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
	const q = getQuery(event)
	const { from, to } = getRangeFromQuery(q, 30)

	const ds = await getDataSource()
	const repo = ds.getRepository(TahsilatTablosu)

	const rows = await repo.createQueryBuilder('t')
		.where('t.Tarih >= :from AND t.Tarih < DATEADD(day, 1, :to)', { from, to })
		.select('t.odemeSekli', 'odemeSekli')
		.addSelect('SUM(t.NetTutar)', 'total')
		.groupBy('t.odemeSekli')
		.orderBy('total', 'DESC')
		.getRawMany<{ odemeSekli: string; total: string }>()

	return rows.map(r => ({ odemeSekli: r.odemeSekli, total: Number(r.total || 0) }))
})


