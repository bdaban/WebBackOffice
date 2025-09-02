<template>
  <div class="min-h-[60vh] grid place-items-center">
    <form @submit.prevent="onSubmit" class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 space-y-4">
      <h1 class="text-lg font-semibold">Giriş</h1>
      <div>
        <label class="block text-xs text-gray-500">Kullanıcı Adı</label>
        <input v-model="username" class="h-9 w-full rounded-md border px-3 text-sm" />
      </div>
      <div>
        <label class="block text-xs text-gray-500">Parola</label>
        <input v-model="password" type="password" class="h-9 w-full rounded-md border px-3 text-sm" />
      </div>
      <button class="h-9 rounded-md bg-gray-900 px-3 text-sm text-white w-full">Giriş Yap</button>
      <p v-if="errorMsg" class="text-sm text-rose-600">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const username = ref('')
const password = ref('')
const errorMsg = ref('')

async function onSubmit() {
  try {
    errorMsg.value = ''
    await login(username.value, password.value)
    await navigateTo('/')
  } catch (e: any) {
    errorMsg.value = 'Giriş başarısız'
  }
}
</script>


