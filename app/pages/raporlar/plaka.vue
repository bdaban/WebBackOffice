<template>
	<div class="space-y-6">
		<div class="rounded-xl border border-gray-200 bg-white p-4">
			<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div class="flex gap-2 items-center">
					<label class="text-sm text-gray-600">Tarih</label>
					<input v-model="from" type="date" class="h-9 rounded-md border-gray-300 text-sm" />
					<input v-model="to" type="date" class="h-9 rounded-md border-gray-300 text-sm" />
				</div>
				<div class="flex gap-2 items-center">
					<input v-model="plate" placeholder="Plaka ara" class="h-9 w-48 rounded-md border border-gray-300 px-3 text-sm" />
					<button @click="reload()" class="inline-flex h-9 items-center rounded-md bg-gray-900 px-3 text-sm text-white">Uygula</button>
				</div>
			</div>
		</div>

		<!-- KPI Summary -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">Toplam Ciro</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ formatCurrency(kpi.total) }}</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">Toplam Miktar</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ formatNumber(kpi.amount) }}</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">Plaka Sayısı</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ kpi.plates }}</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<div class="col-span-2 rounded-xl border border-gray-200 bg-white p-4">
				<h3 class="text-sm font-medium text-gray-600">🚗 Top Plakalar</h3>
				<div class="overflow-auto mt-2">
					<table class="min-w-full text-left text-sm">
						<thead class="bg-gray-50 text-gray-600">
							<tr>
								<th class="px-3 py-2">Plaka</th>
								<th class="px-3 py-2 text-right">İşlem</th>
								<th class="px-3 py-2 text-right">Miktar</th>
								<th class="px-3 py-2 text-right">Tutar</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="r in rows || []" :key="r.plate" class="border-t">
								<td class="px-3 py-2">{{ r.plate }}</td>
								<td class="px-3 py-2 tabular-nums text-right">{{ r.tx }}</td>
								<td class="px-3 py-2 tabular-nums text-right">{{ formatNumber(r.amount) }}</td>
								<td class="px-3 py-2 tabular-nums text-right">{{ formatCurrency(r.total) }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<h3 class="text-sm font-medium text-gray-600">📊 Dağılım</h3>
				<div v-if="pending" class="text-sm text-gray-500">Yükleniyor…</div>
				<div v-else-if="rows.length === 0" class="text-sm text-gray-500">Kayıt bulunamadı.</div>
				<ClientOnly v-else>
					<VChart class="mt-2 h-72 w-full" :option="barOption" autoresize />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
type Row = { plate: string; tx: number; amount: number; total: number }
const from = ref<string>(new Date(Date.now() - 1000*60*60*24*30).toISOString().slice(0,10))
const to = ref<string>(new Date().toISOString().slice(0,10))
const plate = ref<string>('')

const { data, pending, refresh } = await useFetch<Row[]>(() => `/api/plaka/summary?from=${from.value}&to=${to.value}&plate=${encodeURIComponent(plate.value)}`, { server: false, immediate: true, watch: false })
const rows = computed(() => data.value || [])

const barOption = computed(() => ({
	tooltip: { trigger: 'axis' },
	grid: { left: 48, right: 16, top: 16, bottom: 80 },
	xAxis: { type: 'category', axisLabel: { rotate: 45 }, data: rows.value.map(r => r.plate) },
	yAxis: { type: 'value' },
	series: [{ type: 'bar', data: rows.value.map(r => Number(r.total?.toFixed?.(2) ?? r.total)) }]
}))

function reload(){ refresh() }
function formatCurrency(n: number){ return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0) }
function formatNumber(n: number){ return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(n || 0) }

const kpi = computed(() => {
	const list = rows.value || []
	const total = list.reduce((s, r) => s + Number(r.total || 0), 0)
	const amount = list.reduce((s, r) => s + Number(r.amount || 0), 0)
	const plates = list.length
	return { total, amount, plates }
})
</script>


