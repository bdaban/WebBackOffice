<template>
	<div class="space-y-6">
		<div class="rounded-xl border border-gray-200 bg-white p-4">
			<div class="flex items-center justify-between">
				<h3 class="text-sm font-medium text-gray-600">📊 Cari Limit / Tüketim</h3>
				<button @click="reload()" class="inline-flex h-9 items-center rounded-md bg-gray-900 px-3 text-sm text-white">Yenile</button>
			</div>
		</div>

		<!-- KPI Summary -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">Toplam Limit</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ formatCurrency(kpi.totalLimit) }}</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">Toplam Tüketim</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ formatCurrency(kpi.totalUsage) }}</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">Limit Aşan Cari</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ kpi.overLimitCount }}</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<div class="col-span-2 rounded-xl border border-gray-200 bg-white p-4">
				<div v-if="pending" class="text-sm text-gray-500">Yükleniyor…</div>
				<div v-else-if="rows.length === 0" class="text-sm text-gray-500">Kayıt bulunamadı.</div>
				<div v-else class="overflow-auto">
					<table class="min-w-full text-left text-sm">
						<thead class="bg-gray-50 text-gray-600">
							<tr>
								<th class="px-3 py-2">Cari</th>
								<th class="px-3 py-2 text-right">Limit</th>
								<th class="px-3 py-2 text-right">Tüketim</th>
								<th class="px-3 py-2 text-right">Doluluk</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="r in rows || []" :key="r.id" class="border-t">
								<td class="px-3 py-2">{{ r.cariAdi }} ({{ r.cariKodu }})</td>
								<td class="px-3 py-2 tabular-nums text-right">{{ formatCurrency(r.limit) }}</td>
								<td class="px-3 py-2 tabular-nums text-right">{{ formatCurrency(r.tuketim) }}</td>
								<td class="px-3 py-2 tabular-nums text-right">
									<span :class="r.doluluk >= 1 ? 'text-rose-700' : 'text-emerald-700'">{{ formatPercent(r.doluluk) }}</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<h3 class="text-sm font-medium text-gray-600">Doluluk Dağılımı</h3>
				<ClientOnly>
					<VChart class="mt-2 h-72 w-full" :option="histOption" autoresize />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
type Row = { id: number; cariKodu: string; cariAdi: string; limit: number; indirim: number; tuketim: number; doluluk: number }
const { data, pending, refresh } = await useFetch<Row[]>(() => `/api/cari/limit-usage`, { server: false, immediate: true, watch: false })
const rows = computed(() => data.value || [])

const histOption = computed(() => {
	const buckets = [0,0,0,0,0,0]
	for (const r of rows.value) {
		const d = r.doluluk
		const idx = d >= 1 ? 5 : Math.floor(d * 5)
		buckets[idx]++
	}
	return {
		xAxis: { type: 'category', data: ['0-20%','20-40%','40-60%','60-80%','80-100%','100%+'] },
		yAxis: { type: 'value' },
		series: [{ type: 'bar', data: buckets }]
	}
})

const kpi = computed(() => {
	const list = rows.value
	let totalLimit = 0, totalUsage = 0, overLimitCount = 0
	for (const r of list) {
		totalLimit += Number(r.limit || 0)
		totalUsage += Number(r.tuketim || 0)
		if ((r.doluluk || 0) >= 1) overLimitCount++
	}
	return { totalLimit, totalUsage, overLimitCount }
})

function reload(){ refresh() }
function formatCurrency(n: number){ return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0) }
function formatPercent(n: number){ return new Intl.NumberFormat('tr-TR', { style: 'percent', maximumFractionDigits: 0 }).format(n || 0) }
</script>


