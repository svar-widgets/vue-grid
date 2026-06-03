<script setup>
defineOptions({ name: "GridTooltip", inheritAttrs: false });

import { computed } from "vue";
import { getRenderValue } from "@svar-ui/grid-store";
import { Tooltip } from "@svar-ui/vue-core";
import { getID } from "@svar-ui/lib-dom";

function defaultResolver(element) {
	if (!props.api) return null;

	const rowId = getID(element, "data-row-id");
	const columnId = getID(element, "data-col-id");

	if (!rowId || !columnId) return null;

	const row = props.api.getRow(rowId);
	const column = props.api.getColumn(columnId);

	if (column.tooltip === false) return null;
	if (props.overflow && element.scrollWidth <= element.clientWidth)
		return null;

	if (props.content) {
		return { data: { row, column } };
	} else {
		if (typeof column.tooltip === "function") {
			return column.tooltip(row);
		}
		return getRenderValue(row, column);
	}
}

const props = defineProps({
	api: {},
	at: { default: "point" },
	overflow: { type: Boolean, default: false },
	content: { default: null },
	resolver: { type: Function, default: null },
});

const resolverFn = computed(() => props.resolver || defaultResolver);
</script>

<template>
	<Tooltip
		:at="at"
		:content="content"
		:resolver="resolverFn"
		v-bind="$attrs"
	>
		<slot />
	</Tooltip>
</template>
