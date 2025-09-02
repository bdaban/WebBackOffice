import { getDataSource } from '../../db/data-source'
import { TahsilatTablosu } from '../../db/entities/TahsilatTablosu'
import { getRangeFromQuery } from '../../utils/time-range'

export default defineEventHandler(async (event) => {
	const q = getQuery(event)
	const { from, to } = getRangeFromQuery(q, 30)
	const page = Math.max(1, Number(q.page || 1))
	const pageSize = Math.min(100, Math.max(1, Number(q.pageSize || 50)))
	const odeme = String(q.odeme || '').trim()

	const ds = await getDataSource()
	const repo = ds.getRepository(TahsilatTablosu)

	const qb = repo.createQueryBuilder('t')
		.where('t.Tarih >= :from AND t.Tarih < DATEADD(day, 1, :to)', { from, to })
		.select([
			't.id AS id',
			't.cariKodu AS cariKodu',
			't.cariAdi AS cariAdi',
			't.tarih AS tarih',
			't.odemeSekli AS odemeSekli',
			't.netTutar AS netTutar',
		])

	if (odeme) qb.andWhere('t.odemeSekli = :odeme', { odeme })

	qb.orderBy('t.Tarih', 'DESC').offset((page - 1) * pageSize).limit(pageSize)

	const rowsPromise = qb.getRawMany()
	const countQb = repo.createQueryBuilder('t').where('t.Tarih >= :from AND t.Tarih < DATEADD(day, 1, :to)', { from, to })
	if (odeme) countQb.andWhere('t.odemeSekli = :odeme', { odeme })
	const totalPromise = countQb.getCount()

	const [rows, total] = await Promise.all([rowsPromise, totalPromise])
	return { data: rows, pagination: { page, pageSize, total } }
})


