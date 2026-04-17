<script setup>
defineOptions({ name: "GridInlineFiltersText" });

import { Text } from "@svar-ui/vue-core";

const props = defineProps({
	filter: {},
	column: {},
	action: { type: Function },
	filterValue: {},
});

function filterRows({ value }) {
	props.action({ value, key: props.column.id });
}
</script>

<template>
	<Text v-bind="filter.config ?? {}" :value="filterValue" :onchange="filterRows" />
</template>

<style scoped>
:global(.wx-print-filter),
:global(.wx-cell.wx-filter > .wx-text > input) {
	height: 28px;
	padding: 4px 8px;
}

:global(.wx-print-filter) {
	border: var(--wx-table-border);
	background: var(--wx-background);
	border-radius: var(--wx-input-border-radius);
	font-weight: 400;
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
