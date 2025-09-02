import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  setCookie(event, 'session', '', { path: '/', maxAge: 0 })
  return { ok: true }
})


