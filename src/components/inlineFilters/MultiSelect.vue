<script setup>
defineOptions({ name: "GridInlineFiltersMultiSelect" });

import { computed, inject } from "vue";
import { locale } from "@svar-ui/lib-dom";
import { en } from "@svar-ui/grid-locales";
import MultiSelect from "../MultiSelect.vue";

const props = defineProps({
	filter: {},
	column: {},
	action: { type: Function },
	filterValue: {},
});

const _ = inject("wx-i18n")?.getGroup("grid") || locale(en).getGroup("grid");

const config = computed(() => {
	const obj = props.filter?.config || {};
	return { clear: true, ...obj };
});
const options = computed(() => config.value.options || props.column.options);

const text = computed(() => {
	const len = props.filterValue?.length;
	if (!len) return "";
	if (len < 3)
		return props.filterValue.map(v => props.column.optionsMap.get(v)).join(", ");
	return len + " " + _("selected");
});

function filterRows({ value }) {
	props.action({ value, key: props.column.id });
}

function handleKeyDown(ev) {
	if (ev.key !== "Tab") ev.preventDefault();
}
</script>

<template>
	<div style="width: 100%" @keydown="handleKeyDown">
		<MultiSelect
			:placeholder="''"
			v-bind="config"
			:options="options"
			:value="filterValue || []"
			:text="text"
			:onchange="filterRows"
		/>
	</div>
</template>

<style scoped>
:global(.wx-cell.wx-filter div.wx-multiselect) {
	min-height: 28px;
	height: 28px;
}
:global(.wx-cell.wx-filter div.wx-multiselect .wx-label) {
	padding: 4px 8px;
}
</style>
