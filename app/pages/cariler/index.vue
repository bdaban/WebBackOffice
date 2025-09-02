<template>
	<div class="space-y-4">
		<div class="flex items-end justify-between gap-3">
			<div class="flex items-center gap-2">
				<input v-model="query" placeholder="🔎 Ara: ad, kod, email" class="h-9 w-64 rounded-md border border-gray-300 px-3 text-sm" />
				<button @click="reload()" class="inline-flex h-9 items-center rounded-md bg-gray-900 px-3 text-sm text-white">Ara</button>
			</div>
		</div>

		<div class="overflow-auto rounded-xl border border-gray-200 bg-white">
			<table class="min-w-full text-left text-sm">
				<thead class="bg-gray-50 text-gray-600">
					<tr>
						<th class="px-3 py-2">Cari Kodu</th>
						<th class="px-3 py-2">Cari Adı</th>
						<th class="px-3 py-2">Telefon</th>
						<th class="px-3 py-2">E-Posta</th>
						<th class="px-3 py-2">Limit</th>
						<th class="px-3 py-2">Ödeme</th>
						<th class="px-3 py-2"></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in data?.data || []" :key="row.id" class="border-t">
						<td class="px-3 py-2 tabular-nums">{{ row.cariKodu }}</td>
						<td class="px-3 py-2">{{ row.cariAdi }}</td>
						<td class="px-3 py-2">{{ row.telefon }}</td>
						<td class="px-3 py-2">{{ row.email }}</td>
						<td class="px-3 py-2 tabular-nums">{{ formatCurrency(row.limit || 0) }}</td>
						<td class="px-3 py-2">{{ row.odemeSekli }}</td>
						<td class="px-3 py-2 text-right"><NuxtLink :to="`/cariler/${row.id}`" class="text-indigo-600 hover:underline">➡️ Detay</NuxtLink></td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="flex items-center justify-between text-sm text-gray-600">
			<div>Toplam: {{ data?.pagination?.total || 0 }}</div>
			<div class="flex items-center gap-2">
				<button @click="page = Math.max(1, page-1); reload()" class="h-8 rounded-md border border-gray-300 px-2">Önceki</button>
				<div>Sayfa {{ page }}</div>
				<button @click="page = page+1; reload()" class="h-8 rounded-md border border-gray-300 px-2">Sonraki</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const query = ref('')
const page = ref(1)
const pageSize = 20

const { data, refresh } = await useFetch(() => `/api/cariler?query=${encodeURIComponent(query.value)}&page=${page.value}&pageSize=${pageSize}`, { server: false, immediate: true, watch: false })

function reload() { refresh() }

function formatCurrency(n: number) {
	return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 }).format(n || 0)
}
</script>


