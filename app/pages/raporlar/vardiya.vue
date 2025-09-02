<template>
	<div class="space-y-6">
		<div class="rounded-xl border border-gray-200 bg-white p-4">
			<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div class="flex gap-2 items-center">
					<label class="text-sm text-gray-600">Tarih</label>
					<input v-model="from" type="date" class="h-9 rounded-md border-gray-300 text-sm" />
					<input v-model="to" type="date" class="h-9 rounded-md border-gray-300 text-sm" />
				</div>
				<div class="flex gap-2">
					<select v-model="vardiyaNo" class="h-9 rounded-md border-gray-300 text-sm">
						<option value="">Tümü</option>
						<option v-for="v in vardiyalar" :key="v.vardiyaNo" :value="v.vardiyaNo">Vardiya {{ v.vardiyaNo }} ({{ formatCurrency(v.total) }})</option>
					</select>
					<button @click="reload()" class="inline-flex h-9 items-center rounded-md bg-gray-900 px-3 text-sm text-white">Uygula</button>
				</div>
			</div>
		</div>

		<!-- KPI Summary -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs uppercase tracking-wide text-gray-500">Toplam Ciro</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ formatCurrency(totals.total) }}</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs uppercase tracking-wide text-gray-500">Toplam Miktar</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ formatNumber(totals.amount) }}</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="text-xs uppercase tracking-wide text-gray-500">Vardiya Sayısı</div>
				<div class="mt-1 text-xl font-semibold tabular-nums">{{ (vardiyalar || []).length }}</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<div class="col-span-2 rounded-xl border border-gray-200 bg-white p-4">
				<h3 class="text-sm font-medium text-gray-600">🛠️ Vardiya Özeti</h3>
				<div v-if="pendingV" class="text-sm text-gray-500">Yükleniyor…</div>
				<div v-else-if="!vardiyalar || vardiyalar.length === 0" class="text-sm text-gray-500">Kayıt bulunamadı.</div>
				<ClientOnly v-else>
					<VChart class="mt-2 h-72 w-full" :option="barOption" autoresize />
				</ClientOnly>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<h3 class="text-sm font-medium text-gray-600">⛽ Pompa Kırılımı</h3>
				<div v-if="pendingP" class="text-sm text-gray-500">Yükleniyor…</div>
				<div v-else-if="!pumps || pumps.length === 0" class="text-sm text-gray-500">Kayıt bulunamadı.</div>
				<ClientOnly v-else>
					<VChart class="mt-2 h-72 w-full" :option="pumpOption" autoresize />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const from = ref<string>(new Date(Date.now() - 1000*60*60*24*7).toISOString().slice(0,10))
const to = ref<string>(new Date().toISOString().slice(0,10))
const vardiyaNo = ref<string>('')

const { data: vardiyalar, pending: pendingV, refresh } = await useFetch<{ vardiyaNo: string, total: number, amount: number, avgUnitPriceWeighted: number }[]>(() => `/api/vardiya/summary?from=${from.value}&to=${to.value}`, { server: false, immediate: true, watch: false })
const { data: pumps, pending: pendingP, refresh: refreshPumps } = await useFetch<{ pumpNr: number, total: number, amount: number }[]>(() => `/api/vardiya/by-pump?from=${from.value}&to=${to.value}&vardiyaNo=${encodeURIComponent(vardiyaNo.value)}`, { server: false, immediate: true, watch: false })

const totals = computed(() => {
    const list = (vardiyalar.value || []) as Array<{ total: number; amount: number }>
    let total = 0, amount = 0
    for (const r of list) { total += Number(r.total || 0); amount += Number(r.amount || 0) }
    return { total, amount }
})

const barOption = computed(() => ({
	tooltip: { trigger: 'axis' },
	xAxis: { type: 'category', data: (vardiyalar.value || []).map(v => v.vardiyaNo) },
	yAxis: { type: 'value' },
	series: [{ name: 'Ciro', type: 'bar', data: (vardiyalar.value || []).map(v => Number(v.total?.toFixed?.(2) ?? v.total)) }]
}))

const pumpOption = computed(() => ({
	tooltip: { trigger: 'item', formatter: '{b}: {c}' },
	series: [{ name: 'Pompa', type: 'pie', radius: ['40%','70%'], data: (pumps.value || []).map(p => ({ name: 'Pompa '+p.pumpNr, value: Number(p.total?.toFixed?.(2) ?? p.total) })), label: { show: false }, labelLine: { show: false } }]
}))

function reload(){ refresh(); refreshPumps() }
function formatCurrency(n: number){ return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0) }
function formatNumber(n: number){ return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(n || 0) }
</script>


