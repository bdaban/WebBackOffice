<template>
	<div class="min-h-screen bg-gray-50 text-gray-900">
		<div class="flex min-h-screen">
			<!-- Sidebar -->
			<aside class="w-64 shrink-0 border-r border-gray-200 bg-white">
				<div class="h-14 px-4 border-b border-gray-200 flex items-center font-semibold">Backoffice</div>
				<nav class="p-2 text-sm">
					<NuxtLink to="/" class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50">
						<span aria-hidden>🏠</span>
						<span>Dashboard</span>
					</NuxtLink>
					<NuxtLink to="/cariler" class="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50">
						<span aria-hidden>👥</span>
						<span>Cariler</span>
					</NuxtLink>
					<NuxtLink to="/satislar" class="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50">
						<span aria-hidden>🧾</span>
						<span>Satışlar</span>
					</NuxtLink>
					<NuxtLink to="/tahsilatlar" class="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50">
						<span aria-hidden>💵</span>
						<span>Tahsilatlar</span>
					</NuxtLink>
					<div class="mt-1">
						<button @click="reportsOpen = !reportsOpen" class="w-full flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50">
							<span class="inline-flex items-center gap-2"><span aria-hidden>📈</span>Raporlar</span>
							<span class="text-xs">{{ reportsOpen ? '▾' : '▸' }}</span>
						</button>
						<div v-show="reportsOpen" class="mt-1 space-y-1 pl-6">
							<NuxtLink to="/raporlar" class="block rounded-md px-3 py-2 hover:bg-gray-50">Genel</NuxtLink>
							<NuxtLink to="/raporlar/vardiya" class="block rounded-md px-3 py-2 hover:bg-gray-50">Vardiya Performansı</NuxtLink>
							<NuxtLink to="/raporlar/plaka" class="block rounded-md px-3 py-2 hover:bg-gray-50">Plaka Tüketim</NuxtLink>
							<NuxtLink to="/raporlar/cari-limit" class="block rounded-md px-3 py-2 hover:bg-gray-50">Cari Limit/İskonto</NuxtLink>
							<NuxtLink to="/raporlar/urun" class="block rounded-md px-3 py-2 hover:bg-gray-50">Ürün Fiyat/Pay</NuxtLink>
							<NuxtLink to="/raporlar/odeme-trend" class="block rounded-md px-3 py-2 hover:bg-gray-50">Ödeme Trend</NuxtLink>
							<NuxtLink to="/raporlar/tank" class="block rounded-md px-3 py-2 hover:bg-gray-50">Tank Analizi</NuxtLink>
							<NuxtLink to="/raporlar/heatmap" class="block rounded-md px-3 py-2 hover:bg-gray-50">Yoğunluk Isı Haritası</NuxtLink>
							<NuxtLink to="/raporlar/loyalty" class="block rounded-md px-3 py-2 hover:bg-gray-50">Filo/Loyalty</NuxtLink>
							<NuxtLink to="/raporlar/aging" class="block rounded-md px-3 py-2 hover:bg-gray-50">Cari Yaşlandırma</NuxtLink>
						</div>
					</div>
				</nav>
			</aside>

			<!-- Content -->
			<div class="flex-1 min-w-0">
				<header class="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-gray-200">
					<div class="h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-end">
						<button class="inline-flex h-9 items-center rounded-md bg-gray-100 px-3 text-sm hover:bg-gray-200">Tema</button>
						<div class="ml-3 text-sm text-gray-700 flex items-center gap-2" v-if="me">
							<span>👤 {{ me.n || me.u }}</span>
							<button @click="onLogout" class="h-8 rounded-md border px-2">Çıkış</button>
						</div>
					</div>
				</header>
				<main class="px-4 sm:px-6 lg:px-8 py-6">
					<slot />
				</main>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const reportsOpen = ref(false)
const me = ref<any | null>(null)
onMounted(async () => {
	const { data } = await useFetch<{ user: any }>('/api/auth/me', { server: false })
	me.value = data.value?.user || null
})
async function onLogout(){ await useFetch('/api/auth/logout', { method: 'POST', server: false }); me.value = null; navigateTo('/login') }
</script>


