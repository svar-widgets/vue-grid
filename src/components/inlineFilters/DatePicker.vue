<script setup>
import { DatePicker } from "@svar-ui/vue-core";

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
	<div style="width: 100%">
		<DatePicker
			:placeholder="''"
			:clear="true"
			v-bind="filter.config ?? {}"
			:value="filterValue"
			:onchange="filterRows"
		/>
	</div>
</template>

<style scoped>
:global(.wx-cell.wx-filter div.wx-datepicker input) {
	height: 28px;
	padding: 4px 8px;
}
</style>
