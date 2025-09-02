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
		<div ref="wrap" class="rounded-xl border border-gray-200 bg-white p-4">
			<h3 class="text-sm font-medium text-gray-600">🌡️ Saat / Gün Isı Haritası</h3>
			<ClientOnly>
				<VChart v-if="hasSize" ref="chartRef" :key="chartKey" class="mt-2 w-full" style="height: 24rem" :option="option" autoresize />
			</ClientOnly>
		</div>
	</div>
</template>

<script setup lang="ts">
type Row = { dow: number; hour: number; total: number }
const from = ref<string>(new Date(Date.now() - 1000*60*60*24*30).toISOString().slice(0,10))
const to = ref<string>(new Date().toISOString().slice(0,10))
const { data, refresh } = await useFetch<Row[]>(() => `/api/heatmap/sales?from=${from.value}&to=${to.value}`, { server: false, immediate: true, watch: false })

const hours = Array.from({length:24}, (_,i)=> i)
const days = ['Paz','Pzt','Sal','Çar','Per','Cum','Cts']
const seriesData = computed(() => {
	const rows = data.value || []
	return rows.map(r => [r.hour, (r.dow%7), Number(r.total?.toFixed?.(2) ?? r.total)])
})

const option = computed(() => ({
	tooltip: { position: 'top' },
	grid: { left: 60, right: 20, top: 20, bottom: 40 },
	xAxis: { type: 'category', data: hours, splitArea: { show: true } },
	yAxis: { type: 'category', data: days, splitArea: { show: true } },
	visualMap: { min: 0, max: Math.max(1, ...seriesData.value.map(d => d[2] as number)), calculable: true, orient: 'horizontal', left: 'center', bottom: 0 },
	series: [{ name: 'Ciro', type: 'heatmap', data: seriesData.value, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.4)' } } }]
}))

function reload(){ refresh(); chartKey.value++ }
const wrap = ref<HTMLElement>()
const hasSize = ref(false)
const chartKey = ref(0)
const chartRef = ref<any>(null)
let timer: any
let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null

function ensureReadyAndResize(){
	if (!hasSize.value) return
	nextTick(() => {
		try { chartRef.value?.resize?.() } catch {}
	})
}

function checkSize(){
	const w = wrap.value?.clientWidth || 0
	const h = wrap.value?.clientHeight || 0
	hasSize.value = w > 0 && h > 0
	ensureReadyAndResize()
}

onMounted(() => {
	checkSize()
	timer = setInterval(checkSize, 150)
	io = new IntersectionObserver((entries) => {
		for (const e of entries) {
			if (e.isIntersecting) { checkSize() }
		}
	})
	if (wrap.value) io.observe(wrap.value)
	ro = new ResizeObserver(() => { checkSize() })
	if (wrap.value) ro.observe(wrap.value)
	window.addEventListener('resize', checkSize)
})

onBeforeUnmount(() => {
	if (timer) clearInterval(timer)
	if (io) io.disconnect()
	if (ro) ro.disconnect()
	window.removeEventListener('resize', checkSize)
})
</script>


