<template>
	<div class="space-y-6">
		<div class="rounded-xl border border-gray-200 bg-white p-4">
			<div class="flex items-center gap-2">
				<label class="text-sm text-gray-600">Tarih</label>
				<input v-model="from" type="date" class="h-9 rounded-md border-gray-300 text-sm" />
				<input v-model="to" type="date" class="h-9 rounded-md border-gray-300 text-sm" />
				<button @click="reload()" class="inline-flex h-9 items-center rounded-md bg-gray-900 px-3 text-sm text-white">Uygula</button>
			</div>
		</div>

		<!-- KPI Summary -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">Toplam Ciro</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ formatCurrency(kpi.total) }}</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">Kayıt Sayısı</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ kpi.count }}</div>
			</div>
		</div>

		<div class="rounded-xl border border-gray-200 bg-white p-4">
			<h3 class="text-sm font-medium text-gray-600">🪪 Filo / Loyalty Özeti</h3>
			<div v-if="pending" class="text-sm text-gray-500">Yükleniyor…</div>
			<div v-else-if="rows.length === 0" class="text-sm text-gray-500">Kayıt bulunamadı.</div>
			<div v-else class="overflow-auto mt-2">
				<table class="min-w-full text-left text-sm">
					<thead class="bg-gray-50 text-gray-600">
						<tr>
							<th class="px-3 py-2">Filokod</th>
							<th class="px-3 py-2">İsim</th>
							<th class="px-3 py-2 text-right">Tutar</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="r in rows || []" :key="r.key" class="border-t">
							<td class="px-3 py-2">{{ r.key }}</td>
							<td class="px-3 py-2">{{ r.name }}</td>
							<td class="px-3 py-2 tabular-nums text-right">{{ formatCurrency(r.total) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
type Row = { key: string; name: string; total: number }
const from = ref<string>(new Date(Date.now() - 1000*60*60*24*30).toISOString().slice(0,10))
const to = ref<string>(new Date().toISOString().slice(0,10))
const { data, pending, refresh } = await useFetch<Row[]>(() => `/api/loyalty/summary?from=${from.value}&to=${to.value}`, { server: false, immediate: true, watch: false })
const rows = computed(() => data.value || [])
function reload(){ refresh() }
function formatCurrency(n: number){ return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0) }

const kpi = computed(() => {
	const list = rows.value || []
	const total = list.reduce((s, r) => s + Number(r.total || 0), 0)
	const count = list.length
	return { total, count }
})
</script>


