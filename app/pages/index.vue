<template>
	<div class="space-y-6">
		<!-- Filters -->
		<div class="rounded-xl border border-gray-200 bg-white p-4">
			<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div class="flex gap-2 items-center">
					<label class="text-sm text-gray-600">Dönem</label>
					<select v-model="group" class="h-9 rounded-md border-gray-300 text-sm">
						<option value="day">Günlük</option>
						<option value="week">Haftalık</option>
						<option value="month">Aylık</option>
						<option value="quarter">3 Aylık</option>
						<option value="year">Yıllık</option>
					</select>
				</div>
				<div class="flex gap-2">
					<input v-model="from" type="date" class="h-9 rounded-md border-gray-300 text-sm" />
					<input v-model="to" type="date" class="h-9 rounded-md border-gray-300 text-sm" />
					<button @click="refresh()" class="inline-flex h-9 items-center rounded-md bg-gray-900 px-3 text-sm text-white">Uygula</button>
					<button @click="quick('last30d')" class="inline-flex h-9 items-center rounded-md bg-gray-100 px-3 text-sm">Son 30 Gün</button>
					<button @click="quick('ytd')" class="inline-flex h-9 items-center rounded-md bg-gray-100 px-3 text-sm">Yıl Başı - Bugün</button>
				</div>
			</div>
		</div>
		<!-- KPI Cards -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard title="💰 Toplam Satış" :value="formatCurrency(summary?.totalSales || 0)" />
			<StatCard title="⛽ Toplam Miktar" :value="formatNumber(summary?.totalVolume || 0)" subtitle="Litre" />
			<StatCard title="🏷️ Ortalama Fiyat" :value="formatCurrency(summary?.avgUnitPriceWeighted || 0)" />
			<StatCard title="🧾 İşlem Sayısı" :value="formatNumber(summary?.transactions || 0)" />
		</div>

		<!-- Charts -->
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-1">
			<div class="col-span-2 rounded-xl border border-gray-200 bg-white p-4 overflow-hidden">
				<h3 class="text-sm font-medium text-gray-600">📈 Satış Trend</h3>
				<ClientOnly>
					<VChart class="mt-2 w-full" style="height: 360px" :option="trendOption" />
				</ClientOnly>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4 overflow-hidden">
				<h3 class="text-sm font-medium text-gray-600">🧪 Yakıt Dağılımı</h3>
				<ClientOnly>
					<VChart class="mt-2  w-full" style="height: 360px" :option="byFuelOption" />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import StatCard from "~/components/StatCard.vue"

type Summary = {
	totalSales: number
	totalVolume: number
	avgUnitPriceWeighted: number
	transactions: number
}

type TrendPoint = { date: string; total: number; amount: number }
type ByFuelPoint = { fuelType: string | number; total: number }

const from = ref<string>(new Date(Date.now() - 1000*60*60*24*30).toISOString().slice(0,10))
const to = ref<string>(new Date().toISOString().slice(0,10))
const group = ref<'day'|'week'|'month'|'quarter'|'year'>('day')

const { data: summary, refresh: refreshSummary } = await useFetch<Summary>(() => `/api/metrics/summary?from=${from.value}&to=${to.value}`,
{
	server: false,
	immediate: false,
	watch: false
}
)

const { data: trend, refresh: refreshTrend } = await useFetch<TrendPoint[]>(() => `/api/sales/trend?from=${from.value}&to=${to.value}&group=${group.value}`,
{
	server: false,
	immediate: false,
	watch: false
}
)

const { data: byFuel, refresh: refreshFuel } = await useFetch<ByFuelPoint[]>(() => `/api/sales/by-fuel?from=${from.value}&to=${to.value}`,
{
	server: false,
	immediate: false,
	watch: false
}
)

const trendOption = computed(() => {
	const list = (trend.value || [])
	console.log('[trendOption] points', list.length)
	return {
		tooltip: { trigger: 'axis' },
		grid: { left: 32, right: 16, top: 24, bottom: 28 },
		xAxis: { type: 'category', data: list.map(p => p.date) },
		yAxis: { type: 'value' },
		series: [
			{ name: 'Tutar', type: 'line', smooth: true, data: list.map(p => Number((p.total as any)?.toFixed?.(2) ?? p.total)) }
		]
	}
})

const byFuelOption = computed(() => {
	const list = (byFuel.value || [])
	console.log('[byFuelOption] points', list.length)
	return {
		tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
		series: [{
			name: 'Yakıt', type: 'pie', radius: ['40%', '70%'],
			data: list.map(p => ({ name: String(p.fuelType), value: Number((p.total as any)?.toFixed?.(2) ?? p.total) })),
			avoidLabelOverlap: true,
			label: { show: true },
			labelLine: { show: true }
		}]
	}
})

function formatCurrency(n: number) {
	return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 }).format(n || 0)
}
function formatNumber(n: number) {
	return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(n || 0)
}

function refresh() {
	console.log('[refresh] params', { from: from.value, to: to.value, group: group.value })
	refreshSummary()
	refreshTrend()
	refreshFuel()
}

onMounted(() => {
	console.log('[mounted] refresh')
	refresh()
})

function quick(key: 'last30d' | 'ytd') {
	if (key === 'last30d') {
		const d = new Date()
		const f = new Date(d.getTime() - 29*86400000)
		from.value = f.toISOString().slice(0,10)
		to.value = d.toISOString().slice(0,10)
	}
	if (key === 'ytd') {
		const d = new Date()
		const f = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
		from.value = f.toISOString().slice(0,10)
		to.value = d.toISOString().slice(0,10)
	}
	refresh()
}
</script>


