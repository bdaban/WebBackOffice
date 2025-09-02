<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-gray-200 bg-white p-4">
      <h3 class="text-sm font-medium text-gray-600">📆 Cari Yaşlandırma</h3>
      <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div class="rounded-lg border p-3">
          <div class="text-xs text-gray-500">0-30 Gün</div>
          <div class="text-xl font-semibold tabular-nums">{{ formatCurrency(sum.d0_30) }}</div>
        </div>
        <div class="rounded-lg border p-3">
          <div class="text-xs text-gray-500">31-60 Gün</div>
          <div class="text-xl font-semibold tabular-nums">{{ formatCurrency(sum.d31_60) }}</div>
        </div>
        <div class="rounded-lg border p-3">
          <div class="text-xs text-gray-500">61-90 Gün</div>
          <div class="text-xl font-semibold tabular-nums">{{ formatCurrency(sum.d61_90) }}</div>
        </div>
        <div class="rounded-lg border p-3">
          <div class="text-xs text-gray-500">90+ Gün</div>
          <div class="text-xl font-semibold tabular-nums">{{ formatCurrency(sum.d90p) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch<{ d0_30: number; d31_60: number; d61_90: number; d90p: number }>(() => '/api/aging/summary', { server: false, immediate: true, watch: false })
const sum = computed(() => ({
  d0_30: Number(data.value?.d0_30 || 0),
  d31_60: Number(data.value?.d31_60 || 0),
  d61_90: Number(data.value?.d61_90 || 0),
  d90p: Number(data.value?.d90p || 0),
}))

function formatCurrency(n: number){ return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0) }
</script>


