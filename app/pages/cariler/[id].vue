<template>
	<div class="space-y-4">
		<div>
			<NuxtLink to="/cariler" class="text-sm text-gray-600 hover:text-gray-900">← Listeye dön</NuxtLink>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
				<div class="flex items-start justify-between">
					<div>
						<div class="text-xs uppercase tracking-wide text-gray-500">Borç</div>
						<div class="mt-1 text-2xl font-semibold tabular-nums text-rose-700">{{ formatCurrency(totals.debit) }}</div>
					</div>
					<div class="h-8 w-8 rounded-full bg-rose-50 text-rose-700 grid place-items-center">⬇️</div>
				</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
				<div class="flex items-start justify-between">
					<div>
						<div class="text-xs uppercase tracking-wide text-gray-500">Alacak</div>
						<div class="mt-1 text-2xl font-semibold tabular-nums text-emerald-700">{{ formatCurrency(totals.credit) }}</div>
					</div>
					<div class="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 grid place-items-center">⬆️</div>
				</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
				<div class="flex items-start justify-between">
					<div>
						<div class="text-xs uppercase tracking-wide text-gray-500">Bakiye</div>
						<div class="mt-1 text-2xl font-semibold tabular-nums" :class="totals.balance >= 0 ? 'text-rose-700' : 'text-emerald-700'">{{ formatCurrency(totals.balance) }}</div>
					</div>
					<div class="h-8 w-8 rounded-full bg-indigo-50 text-indigo-700 grid place-items-center">⚖️</div>
				</div>
			</div>
		</div>
		<div class="rounded-xl border border-gray-200 bg-white p-4">
			<h2 class="text-base font-semibold">{{ data?.data?.cariAdi }} <span class="text-gray-500">({{ data?.data?.cariKodu }})</span></h2>
			<div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
				<div><span class="text-gray-500">Telefon:</span> {{ data?.data?.telefon || '-' }}</div>
				<div><span class="text-gray-500">E-Posta:</span> {{ data?.data?.email || '-' }}</div>
				<div><span class="text-gray-500">Ödeme Şekli:</span> {{ data?.data?.odemeSekli || '-' }}</div>
				<div><span class="text-gray-500">Limit:</span> {{ formatCurrency(data?.data?.limit || 0) }}</div>
			</div>
		</div>

		<div class="rounded-xl border border-gray-200 bg-white">
			<div class="px-4 py-3 border-b text-sm font-medium text-gray-700">Hesap Ekstresi</div>
			<div class="overflow-auto">
				<table class="min-w-full text-left text-sm">
					<thead class="bg-gray-50 text-gray-600">
						<tr>
							<th class="px-3 py-2">Tarih</th>
							<th class="px-3 py-2">Tür</th>
							<th class="px-3 py-2">Fiş</th>
							<th class="px-3 py-2">Açıklama</th>
							<th class="px-3 py-2 text-right">Borç</th>
							<th class="px-3 py-2 text-right">Alacak</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(r,idx) in data?.ekstre || []" :key="idx" class="border-t">
							<td class="px-3 py-2">{{ formatDate(r.dateTime as any) }}</td>
							<td class="px-3 py-2">
								<span v-if="r.type === 'SATIS'" class="inline-flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
									<span aria-hidden>⛽</span>
									<span>Satış</span>
								</span>
								<span v-else class="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
									<span aria-hidden>💵</span>
									<span>Tahsilat</span>
								</span>
							</td>
							<td class="px-3 py-2">{{ r.fisNo }}</td>
							<td class="px-3 py-2">{{ r.aciklama }}</td>
							<td class="px-3 py-2 tabular-nums text-right" :class="r.debit ? 'text-rose-700' : 'text-gray-800'">{{ formatCurrency(r.debit) }}</td>
							<td class="px-3 py-2 tabular-nums text-right" :class="r.credit ? 'text-emerald-700' : 'text-gray-800'">{{ formatCurrency(r.credit) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="px-4 py-3 border-t text-sm flex items-center justify-end gap-6">
				<div>Borç: <span class="tabular-nums">{{ formatCurrency(totals.debit) }}</span></div>
				<div>Alacak: <span class="tabular-nums">{{ formatCurrency(totals.credit) }}</span></div>
				<div :class="totals.balance >= 0 ? 'text-rose-700' : 'text-emerald-700'" class="font-semibold">Bakiye: <span class="tabular-nums">{{ formatCurrency(totals.balance) }}</span></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id
const { data } = await useFetch<any>(() => `/api/cariler/${id}`, { server: false, immediate: true, watch: false })

const totals = computed(() => {
	const list = (data.value?.ekstre || []) as Array<{ debit: number; credit: number }>
	let debit = 0
	let credit = 0
	for (const r of list) {
		debit += Number(r.debit || 0)
		credit += Number(r.credit || 0)
	}
	return { debit, credit, balance: debit - credit }
})

function formatCurrency(n: number) {
	return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 }).format(n || 0)
}
function formatNumber(n: number) {
	return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(n || 0)
}
function formatDate(d?: string) {
	if (!d) return '-'
	const dt = new Date(d)
	return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'short', timeStyle: 'short' }).format(dt)
}
</script>


