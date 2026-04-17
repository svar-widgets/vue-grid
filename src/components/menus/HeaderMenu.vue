<script setup>
import { computed } from "vue";
import { subscribeLater } from "@svar-ui/lib-vue";
import { ContextMenu, registerMenuItem } from "@svar-ui/vue-menu";
import HeaderMenuItem from "./HeaderMenuItem.vue";

const props = defineProps({
	columns: { type: Object, default: null },
	api: {},
});

registerMenuItem("table-header", HeaderMenuItem);

function getLabel(col) {
	for (let i = col.header.length - 1; i >= 0; i--) {
		const text = col.header[i].text;
		if (text) return text;
	}
	return col.id;
}

function headerMenuClick(e) {
	const col = e.action;
	if (col) {
		props.api.exec("hide-column", { id: col.id, mode: !col.hidden });
	}
}

function open(id) {
	return id;
}

const rColumnsSub = subscribeLater(() => props.api?.getReactiveState()?._columns);

const headerMenuOptions = computed(() => {
	if (props.api) {
	    const cols = rColumnsSub();
		const included = props.columns
			? cols.value.filter(c => props.columns[c.id])
			: cols.value;

		return included.map(c => {
			const text = getLabel(c);
			return {
				id: c.id,
				text,
				type: "table-header",
				hidden: c.hidden,
			};
		});
	} else {
		return [];
	}
});
</script>

<template>
	<ContextMenu
		data-key="headerId"
		:options="headerMenuOptions"
		:onclick="headerMenuClick"
		at="point"
		:resolver="open"
	>
		<slot />
	</ContextMenu>
</template>
