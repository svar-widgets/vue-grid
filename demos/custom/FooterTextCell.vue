<script setup>
const props = defineProps({
	cell: {},
});
</script>

<template>
	<div class="footer-content">
		<span>{{ cell.text }}</span>
		<i class="wxi-check"></i>
	</div>
</template>

<style scoped>
.footer-content {
	display: flex;
	align-items: center;
	gap: 6px;
}

.footer-content i {
	display: inline-flex;
	font-size: 20px;
}
</style>
