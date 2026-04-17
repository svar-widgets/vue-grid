<script setup>
defineOptions({ name: "GridInlineFiltersRichselect" });

import { computed, inject } from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import { RichSelect } from "@svar-ui/vue-core";
import { getValue } from "@svar-ui/grid-store";

const props = defineProps({
	filter: {},
	column: {},
	action: { type: Function },
	filterValue: {},
});

const api = inject("grid-store");
const { flatData } = api.getReactiveState();
const data = subscribe(flatData);

const options = computed(
	() => props.filter?.config?.options || props.column.options || getOptions()
);
const template = computed(() => props.filter?.config?.template);

function getOptions() {
	const opts = [];
	data.value.forEach(d => {
		const value = getValue(d, props.column);
		if (!opts.includes(value)) opts.push(value);
	});
	return opts.map(opt => ({ id: opt, label: opt }));
}

function filterRows({ value }) {
	props.action({ value, key: props.column.id });
}

function handleKeyDown(ev) {
	if (ev.key !== "Tab") ev.preventDefault();
}
</script>

<template>
	<div style="width: 100%" @keydown="handleKeyDown">
		<RichSelect
			:placeholder="''"
			:clear="true"
			v-bind="filter.config ?? {}"
			:options="options"
			:value="filterValue"
			:onchange="filterRows"
		>
			<template #default="{ option }">
				<template v-if="template">
					{{ template(option) }}
				</template>
				<template v-else>
					{{ option.label }}
				</template>
			</template>
		</RichSelect>
	</div>
</template>

<style scoped>
:global(.wx-cell.wx-filter div.wx-richselect) {
	min-height: 28px;
	height: 28px;
	padding: 4px 8px;
}
:global(.wx-cell.wx-filter div.wx-richselect .wx-label) {
	padding: 0;
}
</style>
