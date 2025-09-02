<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">🧾 Satışlar (Vardiya)</h1>
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
        <label class="block text-xs text-gray-500">Vardiya No</label>
        <input v-model="vardiyaNo" type="text" class="input" placeholder="örn. 1" />
      </div>
      <button class="btn" @click="reload">Uygula</button>
    </div>

    <div class="overflow-x-auto border rounded-md">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="th">Tarih</th>
            <th class="th">Fiş</th>
            <th class="th">Ürün</th>
            <th class="th text-right">Miktar</th>
            <th class="th text-right">Tutar</th>
            <th class="th">Pompa</th>
            <th class="th">Plaka</th>
            <th class="th">Filo</th>
            <th class="th">Tag</th>
            <th class="th">Vardiya</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r,idx) in rows" :key="idx" class="border-t">
            <td class="td">{{ formatDate(r.dateTime) }}</td>
            <td class="td">{{ r.receiptNr }}</td>
            <td class="td">{{ r.fuelType }}</td>
            <td class="td text-right">{{ formatNumber(r.amount) }}</td>
            <td class="td text-right">{{ formatMoney(r.total) }}</td>
            <td class="td">{{ r.pumpNr }}</td>
            <td class="td">{{ r.plate }}</td>
            <td class="td">{{ r.fleetName }}</td>
            <td class="td">{{ r.tagNr }}</td>
            <td class="td">{{ r.vardiyaNo }}</td>
          </tr>
          <tr v-if="!loading && rows.length === 0">
            <td class="td" colspan="10">Kayıt bulunamadı.</td>
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
const from = ref(new Date(today.getTime() - 6 * 86400000).toISOString().slice(0, 10))
const vardiyaNo = ref('')
const page = ref(1)
const pageSize = ref(50)

const rows = ref<any[]>([])
const pagination = ref<{ total: number }>({ total: 0 })
const loading = ref(false)

function qs() {
  const p = new URLSearchParams()
  p.set('from', from.value)
  p.set('to', to.value)
  if (vardiyaNo.value) p.set('vardiyaNo', vardiyaNo.value)
  p.set('page', String(page.value))
  p.set('pageSize', String(pageSize.value))
  return p.toString()
}

async function reload() {
  loading.value = true
  const { data, error } = await useFetch(`/api/vardiya-sales?${qs()}`, { server: false })
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
function formatNumber(n: number) {
  return (n || 0).toLocaleString('tr-TR', { maximumFractionDigits: 2 })
}
</script>

<style lang="postcss" scoped>
@reference "../../assets/css/main.css";
.input { @apply h-9 rounded-md border px-3 text-sm bg-white; }
.btn { @apply h-9 rounded-md bg-blue-600 text-white px-3 text-sm hover:bg-blue-700 disabled:opacity-50; }
.th { @apply text-left font-medium px-3 py-2; }
.td { @apply px-3 py-2; }
</style>


