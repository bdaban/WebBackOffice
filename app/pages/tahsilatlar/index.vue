<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">💵 Tahsilatlar</h1>
    <div class="flex flex-wrap gap-2 items-end">
      <div>
        <label class="block text-xs text-gray-500">Başlangıç</label>
        <input v-model="from" type="date" class="input" />
      </div>
      <div>
        <label class="block text-xs text-gray-500">Bitiş</label>
        <input v-model="to" type="date" class="input" />
      </div>
      <div>
        <label class="block text-xs text-gray-500">Ödeme</label>
        <input v-model="odeme" type="text" class="input" placeholder="örn. Nakit" />
      </div>
      <button class="btn" @click="reload">Uygula</button>
    </div>

    <div class="overflow-x-auto border rounded-md">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="th">Tarih</th>
            <th class="th">Cari</th>
            <th class="th">Ödeme</th>
            <th class="th text-right">Tutar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id" class="border-t">
            <td class="td">{{ formatDate(r.tarih) }}</td>
            <td class="td">{{ r.cariAdi || r.cariKodu }}</td>
            <td class="td">{{ r.odemeSekli }}</td>
            <td class="td text-right">{{ formatMoney(r.netTutar) }}</td>
          </tr>
          <tr v-if="!loading && rows.length === 0">
            <td class="td" colspan="4">Kayıt bulunamadı.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-500">Toplam: {{ pagination.total }}</div>
      <div class="flex gap-2">
        <button class="btn" :disabled="page === 1" @click="page--; reload()">Önceki</button>
        <button class="btn" :disabled="page * pageSize >= pagination.total" @click="page++; reload()">Sonraki</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const today = new Date()
const to = ref(today.toISOString().slice(0, 10))
const from = ref(new Date(today.getTime() - 29 * 86400000).toISOString().slice(0, 10))
const odeme = ref('')
const page = ref(1)
const pageSize = ref(50)

const rows = ref<any[]>([])
const pagination = ref<{ total: number }>({ total: 0 })
const loading = ref(false)

function qs() {
  const p = new URLSearchParams()
  p.set('from', from.value)
  p.set('to', to.value)
  if (odeme.value) p.set('odeme', odeme.value)
  p.set('page', String(page.value))
  p.set('pageSize', String(pageSize.value))
  return p.toString()
}

async function reload() {
  loading.value = true
  const { data, error } = await useFetch(`/api/tahsilatlar?${qs()}`, { server: false })
  loading.value = false
  if (error.value) return
  const res: any = data.value
  rows.value = res?.data || []
  pagination.value = res?.pagination || { total: 0 }
}

onMounted(reload)

function formatDate(val: string) {
  if (!val) return ''
  return new Date(val).toLocaleString()
}
function formatMoney(n: number) {
  return (n || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 })
}
</script>

<style lang="postcss" scoped>
@reference "../../assets/css/main.css";
.input { @apply h-9 rounded-md border px-3 text-sm bg-white; }
.btn { @apply h-9 rounded-md bg-blue-600 text-white px-3 text-sm hover:bg-blue-700 disabled:opacity-50; }
.th { @apply text-left font-medium px-3 py-2; }
.td { @apply px-3 py-2; }
</style>


