<script setup>
import { Checkbox } from "@svar-ui/vue-core";

const props = defineProps({
	row: {},
	column: {},
	onaction: { type: Function },
	api: {},
});

function onChange(ev) {
	const { value } = ev;

	//execute update action
	props.api.exec("update-cell", {
		id: props.row.id,
		column: props.column.id,
		value,
	});
	//trigger custom event
	props.onaction?.({
		action: "custom-check",
		data: {
			value,
			column: props.column.id,
			row: props.row.id,
		},
	});
}
</script>

<template>
	<Checkbox :value="row[column.id]" :onchange="onChange" />
</template>
