import { getDataSource } from '../../db/data-source'
import { Cariler } from '../../db/entities/Cariler'
import { CariHareketler } from '../../db/entities/CariHareketler'
import { TahsilatTablosu } from '../../db/entities/TahsilatTablosu'

export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, 'id'))
	if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })
  const q = getQuery(event)
  const limit = Math.min(500, Math.max(1, Number(q.limit || 200)))

	const ds = await getDataSource()
	const carilerRepo = ds.getRepository(Cariler)
	const hareketRepo = ds.getRepository(CariHareketler)
  const tahsilatRepo = ds.getRepository(TahsilatTablosu)

	const cari = await carilerRepo.findOne({ where: { id } })
	if (!cari) throw createError({ statusCode: 404, statusMessage: 'Cari not found' })

  const cariKodu = (cari.cariKodu || cari.cariKodu) as string | null

  // Satis hareketleri (debit)
  const satisQb = hareketRepo.createQueryBuilder('h')
    .where('(h.CariId = :id' + (cariKodu ? ' OR h.CariKodu = :ck' : '') + ')', { id, ck: cariKodu || undefined })
    .orderBy('h.Tarih', 'DESC')
    .addOrderBy('h.Saat', 'DESC')
    .limit(limit)

  const satis = await satisQb.getMany()

  // Tahsilatlar (credit)
  const tahsQb = tahsilatRepo.createQueryBuilder('t')
    .where('(t.CariId = :id' + (cariKodu ? ' OR t.CariKodu = :ck' : '') + ')', { id, ck: cariKodu || undefined })
    .orderBy('t.Tarih', 'DESC')
    .addOrderBy('t.Saat', 'DESC')
    .limit(limit)

  const tahsilatlar = await tahsQb.getMany()

  // Birleşik hesap ekstresi
  const ekstre = [
    ...satis.map(s => ({
      type: 'SATIS' as const,
      dateTime: s.tarih || s.saat || null,
      fisNo: s.fisNo,
      aciklama: [s.yakitAdi, s.plaka].filter(Boolean).join(' - '),
      debit: Number(s.netTutar || 0),
      credit: 0,
    })),
    ...tahsilatlar.map(t => ({
      type: 'TAHSILAT' as const,
      dateTime: t.tarih || t.saat || null,
      fisNo: t.fisNo as any,
      aciklama: [t.odemeSekli, t.yakitAdi].filter(Boolean).join(' - '),
      debit: 0,
      credit: Number(t.netTutar || t.tutar || 0),
    })),
  ].sort((a, b) => {
    const da = a.dateTime ? new Date(a.dateTime as any).getTime() : 0
    const db = b.dateTime ? new Date(b.dateTime as any).getTime() : 0
    return db - da
  }).slice(0, limit)

	return { data: cari, lastMoves: satis.slice(0, 20), ekstre }
})


