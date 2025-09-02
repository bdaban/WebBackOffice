export default defineNuxtRouteMiddleware(async (to) => {
  // Serbest sayfalar
  const publicPages = new Set(['/login'])
  if (publicPages.has(to.path)) return

  const { data } = await useFetch<{ user: any }>('/api/auth/me', { server: false })
  if (!data.value?.user) {
    return navigateTo('/login')
  }
})


