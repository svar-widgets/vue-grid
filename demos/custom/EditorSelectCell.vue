<script setup>
const props = defineProps({
	data: {},
});
</script>

<template>
	<div v-if="data" class="container">
		<div class="avatar">
			<span>{{ data.label[0] }}</span>
		</div>
		<span class="name">{{ data.label }}</span>
	</div>
	<span v-else class="empty">not selected</span>
</template>

<style scoped>
.container {
	height: 100%;
	display: flex;
	align-items: center;
	gap: 12px;
}
.avatar {
	height: 24px;
	width: 24px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: var(--wx-color-primary);
}
.avatar span {
	color: white;
	font-weight: 600;
}
.empty {
	color: var(--wx-color-font-disabled);
}
</style>
