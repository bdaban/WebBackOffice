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
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">Toplam Ciro</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ formatCurrency(kpi.total) }}</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">İşlem Günü</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ kpi.days }}</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs text-gray-500">Ödeme Türü</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ kpi.types }}</div>
			</div>
		</div>

		<div class="rounded-xl border border-gray-200 bg-white p-4">
			<h3 class="text-sm font-medium text-gray-600">💳 Ödeme Şekli Trend</h3>
			<div v-if="pending" class="text-sm text-gray-500">Yükleniyor…</div>
			<div v-else-if="(data?.value || []).length === 0" class="text-sm text-gray-500">Kayıt bulunamadı.</div>
			<ClientOnly v-else>
				<VChart class="mt-2 h-96 w-full" :option="option" autoresize />
			</ClientOnly>
		</div>
	</div>
</template>

<script setup lang="ts">
type Row = { date: string; odeme: string; total: number }
const from = ref<string>(new Date(Date.now() - 1000*60*60*24*30).toISOString().slice(0,10))
const to = ref<string>(new Date().toISOString().slice(0,10))
const { data, pending, refresh } = await useFetch<Row[]>(() => `/api/odeme/trend?from=${from.value}&to=${to.value}`, { server: false, immediate: true, watch: false })

const option = computed(() => {
	const rows = data.value || []
	const dates = Array.from(new Set(rows.map(r => r.date)))
	const types = Array.from(new Set(rows.map(r => r.odeme || 'Bilinmiyor')))
	return {
		tooltip: { trigger: 'axis' },
		legend: { data: types },
		xAxis: { type: 'category', data: dates },
		yAxis: { type: 'value' },
		series: types.map(o => ({ name: o, type: 'line', smooth: true, data: dates.map(d => Number((rows.find(r => (r.odeme||'Bilinmiyor')===o && r.date===d)?.total as any)?.toFixed?.(2) ?? 0)) }))
	}
})

function reload(){ refresh() }

const kpi = computed(() => {
	const rows = data.value || []
	const total = rows.reduce((s, r) => s + Number(r.total || 0), 0)
	const days = new Set(rows.map(r => r.date)).size
	const types = new Set(rows.map(r => r.odeme || 'Bilinmiyor')).size
	return { total, days, types }
})
function formatCurrency(n: number){ return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0) }
</script>


