import { getDataSource } from '../../db/data-source'
import { setCookie, readBody, H3Event } from 'h3'

type LoginBody = { username?: string; password?: string }

export default defineEventHandler(async (event: H3Event) => {
  const body = (await readBody<LoginBody>(event)) || {}
  const username = String(body.username || '').trim()
  const password = String(body.password || '').trim()

  if (!username || !password) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'Kullanıcı adı ve parola gerekli' }
  }

  const ds = await getDataSource()
  const rows = await ds
    .createQueryBuilder()
    .from('dbo.Users', 'u')
    .where('u.KullaniciAdi = :u AND u.Parola = :p', { u: username, p: password })
    .select(['u.Id AS id', 'u.KullaniciAdi AS kullaniciAdi', 'u.Adi AS adi', 'u.Soyadi AS soyadi'])
    .limit(1)
    .getRawMany<{ id: number; kullaniciAdi: string; adi: string; soyadi: string }>()

  const user = rows[0]
  if (!user) {
    setResponseStatus(event, 401)
    return { ok: false, message: 'Geçersiz kullanıcı adı/parola' }
  }

  const payload = { u: user.kullaniciAdi, n: `${user.adi || ''} ${user.soyadi || ''}`.trim() }
  const value = Buffer.from(JSON.stringify(payload)).toString('base64')
  setCookie(event, 'session', value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return { ok: true, user: payload }
})


