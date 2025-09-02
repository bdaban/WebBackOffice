import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const cookie = getCookie(event, 'session')
  if (!cookie) return { user: null }
  try {
    const json = JSON.parse(Buffer.from(cookie, 'base64').toString('utf8'))
    return { user: json }
  } catch {
    return { user: null }
  }
})


