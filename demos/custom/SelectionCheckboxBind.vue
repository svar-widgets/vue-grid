<script setup>
import { Checkbox } from "@svar-ui/vue-core";
import { subscribe } from "@svar-ui/lib-vue";

const props = defineProps({
	row: {},
	api: {},
});

const selectedRows = subscribe(props.api.getReactiveState().selectedRows);

function onChange(ev) {
	const { value } = ev;

	props.api.exec("select-row", {
		id: props.row.id,
		mode: value,
		toggle: true,
	});
}
</script>

<template>
	<div data-action="ignore-click">
		<Checkbox
			:onchange="onChange"
			:value="selectedRows.indexOf(row.id) !== -1"
		/>
	</div>
</template>
