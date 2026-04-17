<script setup>
import { computed } from "vue";

const props = defineProps({
	row: {},
	column: {},
});

const value = computed(() => props.row[props.column.id]);
</script>

<template>
	<div v-if="value" class="color_block" :style="{ backgroundColor: value }">
		<span>{{ value }}</span>
	</div>
</template>

<style scoped>
.color_block {
	height: 20px;
	width: 20px;
	border-radius: 3px;
	border: var(--wx-table-cell-border);
}
span {
	padding-left: 26px;
}
</style>
