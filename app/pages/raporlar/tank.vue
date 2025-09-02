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
		<div class="rounded-xl border border-gray-200 bg-white p-4">
			<h3 class="text-sm font-medium text-gray-600">🛢️ Tank Özeti</h3>
			<div class="overflow-auto mt-2">
				<table class="min-w-full text-left text-sm">
					<thead class="bg-gray-50 text-gray-600">
						<tr>
							<th class="px-3 py-2">Tank</th>
							<th class="px-3 py-2 text-right">Min</th>
							<th class="px-3 py-2 text-right">Maks</th>
							<th class="px-3 py-2 text-right">Teslimat</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="r in rows || []" :key="r.tank" class="border-t">
							<td class="px-3 py-2">{{ r.tank }}</td>
							<td class="px-3 py-2 tabular-nums text-right">{{ r.minVol }}</td>
							<td class="px-3 py-2 tabular-nums text-right">{{ r.maxVol }}</td>
							<td class="px-3 py-2 tabular-nums text-right">{{ r.delivery }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div ref="pieWrap" class="rounded-xl border border-gray-200 bg-white p-4">
			<h3 class="text-sm font-medium text-gray-600">🥧 Teslimat Dağılımı</h3>
			<div v-if="pending" class="text-sm text-gray-500">Yükleniyor…</div>
			<div v-else-if="!rows || rows.length === 0" class="text-sm text-gray-500">Kayıt bulunamadı.</div>
			<ClientOnly v-else>
				<VChart v-if="pieHasSize" :key="pieKey" class="mt-2 h-80 w-full" :option="pieOption" autoresize />
			</ClientOnly>
		</div>
	</div>
</template>

<script setup lang="ts">
type Row = { tank: string; minVol: number; maxVol: number; delivery: number }
const from = ref<string>(new Date(Date.now() - 1000*60*60*24*7).toISOString().slice(0,10))
const to = ref<string>(new Date().toISOString().slice(0,10))
const { data, pending, refresh } = await useFetch<Row[]>(() => `/api/tank/summary?from=${from.value}&to=${to.value}`, { server: false, immediate: true, watch: false })
const rows = computed(() => data.value || [])
function reload(){ refresh() }

const pieOption = computed(() => ({
	tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
	series: [{
		name: 'Teslimat', type: 'pie', radius: ['40%','70%'],
		data: (rows.value || []).map(r => ({ name: r.tank || 'Bilinmiyor', value: Number(r.delivery || 0) })),
		label: { show: false }, labelLine: { show: false }
	}]
}))

const pieKey = ref(0)
watch(rows, () => { pieKey.value += 1 }, { deep: true })

const pieWrap = ref<HTMLElement>()
const pieHasSize = ref(false)
let timer: any
onMounted(() => {
	const check = () => {
		const w = pieWrap.value?.clientWidth || 0
		const h = pieWrap.value?.clientHeight || 0
		if (w > 0 && h > 0) {
			pieHasSize.value = true
			if (timer) clearInterval(timer)
		}
	}
	check()
	timer = setInterval(check, 100)
	window.addEventListener('resize', check)
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>


