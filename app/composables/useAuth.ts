export function useAuth() {
  const user = ref<any | null>(null)

  async function fetchUser() {
    const { data } = await useFetch<{ user: any }>('/api/auth/me', { server: false })
    user.value = data.value?.user || null
  }

  async function login(username: string, password: string) {
    const { data, error } = await useFetch('/api/auth/login', {
      method: 'POST', body: { username, password }, server: false
    })
    if (error.value) throw error.value
    await fetchUser()
  }

  async function logout() {
    await useFetch('/api/auth/logout', { method: 'POST', server: false })
    user.value = null
  }

  onMounted(fetchUser)

  return { user, fetchUser, login, logout }
}


