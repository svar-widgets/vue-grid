<script setup>
const props = defineProps({
	data: {},
});
</script>

<template>
	<div v-if="data" class="date">
		<i class="wxi-calendar"></i>
		<span>{{ data.toLocaleDateString() }}</span>
	</div>
	<span v-else class="empty">no date</span>
</template>

<style scoped>
.date {
	height: 100%;
	display: flex;
	align-items: center;
	gap: 12px;
}
.date i {
	color: var(--wx-color-primary);
	font-size: 20px;
}
.empty {
	color: var(--wx-color-font-disabled);
}
</style>
