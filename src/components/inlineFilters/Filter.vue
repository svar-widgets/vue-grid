<script setup>
defineOptions({ name: "GridInlineFiltersFilter" });

import { computed, inject } from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import { filters } from "./filters";

const props = defineProps({
	filter: {},
	column: {},
});

const api = inject("grid-store");
const { filterValues } = api.getReactiveState();
const filterValuesRef = subscribe(filterValues);

function filterRows(data) {
	api.exec("filter-rows", data);
}

const filterComponent = computed(() => filters[props.filter.type]);
</script>

<template>
	<component
		:is="filterComponent"
		:filter="filter"
		:column="column"
		:action="filterRows"
		:filter-value="filterValuesRef[column.id]"
	/>
</template>
