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
					<select v-model="odeme" class="h-9 rounded-md border-gray-300 text-sm">
						<option value="">Tümü</option>
						<option v-for="o in odemeler" :key="o" :value="o">{{ o }}</option>
					</select>
					<button @click="reload()" class="inline-flex h-9 items-center rounded-md bg-gray-900 px-3 text-sm text-white">Uygula</button>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<div class="col-span-2 rounded-xl border border-gray-200 bg-white p-4">
				<h3 class="text-sm font-medium text-gray-600">Tahsilatlar</h3>
				<div class="overflow-auto mt-2">
					<table class="min-w-full text-left text-sm">
						<thead class="bg-gray-50 text-gray-600">
							<tr>
								<th class="px-3 py-2">Tarih</th>
								<th class="px-3 py-2">Cari</th>
								<th class="px-3 py-2">Ödeme</th>
								<th class="px-3 py-2 text-right">Tutar</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="r in list?.data || []" :key="r.id" class="border-t">
								<td class="px-3 py-2">{{ formatDate(r.tarih) }}</td>
								<td class="px-3 py-2">{{ r.cariAdi }} ({{ r.cariKodu }})</td>
								<td class="px-3 py-2">{{ r.odemeSekli }}</td>
								<td class="px-3 py-2 tabular-nums text-right">{{ formatCurrency(r.netTutar) }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<h3 class="text-sm font-medium text-gray-600">Ödeme Şekli Dağılımı</h3>
				<ClientOnly>
					<VChart class="mt-2 h-72 w-full" :option="pieOption" autoresize />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const from = ref<string>(new Date(Date.now() - 1000*60*60*24*30).toISOString().slice(0,10))
const to = ref<string>(new Date().toISOString().slice(0,10))
const odeme = ref<string>('')
const odemeler = ['NAKİT','KREDİ KARTI','HAVALE','EFT','ÇEK']

const { data: list, refresh } = await useFetch<any>(() => `/api/tahsilatlar?from=${from.value}&to=${to.value}&odeme=${encodeURIComponent(odeme.value)}`, { server: false, immediate: true, watch: false })
const { data: byOdeme, refresh: refreshPie } = await useFetch<{ odemeSekli: string, total: number }[]>(() => `/api/tahsilatlar/by-odeme?from=${from.value}&to=${to.value}`, { server: false, immediate: true, watch: false })

const pieOption = computed(() => ({
	tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
	series: [{ name: 'Ödeme', type: 'pie', radius: ['40%','70%'], data: (byOdeme.value || []).map(r => ({ name: r.odemeSekli || 'Bilinmiyor', value: r.total })), label: { show: false }, labelLine: { show: false } }]
}))

function reload() { refresh(); refreshPie() }
function formatCurrency(n: number) { return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0) }
function formatDate(d?: string) { if (!d) return '-'; const dt = new Date(d); return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'short', timeStyle: 'short' }).format(dt) }
</script>


