<template>
	<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
		<div class="text-sm text-gray-500">{{ title }}</div>
		<div class="mt-2 text-2xl font-semibold tabular-nums">{{ value }}</div>
		<div v-if="subtitle" class="mt-1 text-xs text-gray-500">{{ subtitle }}</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	title: string
	value: string | number
	subtitle?: string
}
defineProps<Props>()
</script>


