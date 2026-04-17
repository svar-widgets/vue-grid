<script setup>
import { Checkbox } from "@svar-ui/vue-core";

const props = defineProps({
	row: {},
	api: {},
});

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
		<Checkbox :onchange="onChange" />
	</div>
</template>
