<script setup>
import { Button } from "@svar-ui/vue-core";

const props = defineProps({
	row: {},
	column: {},
	onaction: { type: Function },
	api: {},
});

function onClick() {
	props.onaction?.({
		action: "custom-button",
		data: {
			column: props.column.id,
			row: props.row.id,
		},
	});
}
</script>

<template>
	<span class="name">{{ row[column.id] || "Unknown" }}</span>
	<Button type="primary" :disabled="!row[column.id]" :onclick="onClick">
		Show on map
	</Button>
</template>

<style scoped>
.name {
	margin-top: 6px;
	display: inline-block;
	width: 100px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
