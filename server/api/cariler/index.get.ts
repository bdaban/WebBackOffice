import { getDataSource } from '../../db/data-source'
import { Cariler } from '../../db/entities/Cariler'

export default defineEventHandler(async (event) => {
	const q = getQuery(event)
	const page = Math.max(1, Number(q.page || 1))
	const pageSize = Math.min(100, Math.max(1, Number(q.pageSize || 20)))
	const search = String(q.query || '').trim()

	const ds = await getDataSource()
	const repo = ds.getRepository(Cariler)

	const qb = repo.createQueryBuilder('c')
		.select([
			'c.id AS id',
			'c.cariKodu AS cariKodu',
			'c.cariAdi AS cariAdi',
			'c.telefon AS telefon',
			'c.email AS email',
			'c.odemeSekli AS odemeSekli',
			'c.limit AS [limit]',
		])

	if (search) {
		qb.where('c.cariAdi LIKE :s', { s: `%${search}%` })
	}

	qb.orderBy('c.cariAdi', 'ASC')
		.offset((page - 1) * pageSize)
		.limit(pageSize)

	const rowsPromise = qb.getRawMany()

	const countQb = repo.createQueryBuilder('c')
	if (search) {
		countQb.where('c.cariAdi LIKE :s', { s: `%${search}%` })
	}
	const totalPromise = countQb.getCount()

	const [rows, total] = await Promise.all([rowsPromise, totalPromise])

	return {
		data: rows,
		pagination: { page, pageSize, total }
	}
})


