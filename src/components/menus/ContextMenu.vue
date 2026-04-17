<script setup>
defineOptions({ name: "GridContextMenu" });

import { computed, inject } from "vue";
import { subscribeLater } from "@svar-ui/lib-vue";
import { ContextMenu } from "@svar-ui/vue-menu";
import {
	defaultMenuOptions,
	assignChecks,
	handleAction,
} from "@svar-ui/grid-store";
import { locale } from "@svar-ui/lib-dom";
import { en } from "@svar-ui/grid-locales";

const props = defineProps({
	api: {},
	options: { default: () => [...defaultMenuOptions] },
	at: { default: "point" },
	resolver: { type: Function, default: undefined },
	dataKey: {},
	filter: {},
	css: {},
	onclick: { type: Function },
});

const i18n = inject("wx-i18n", null);
const _ = i18n?.getGroup("grid") || locale(en).getGroup("grid");

const selectedRowsSub = subscribeLater(() => props.api?.getReactiveState()?.selectedRows);
const dataSub = subscribeLater(() => props.api?.getReactiveState()?.data);
const reorderSub = subscribeLater(() => props.api?.getReactiveState()?.reorder);

function applyLocale(options) {
	options.forEach(op => {
		if (op.text) op.text = _(op.text);
		if (op.subtext) op.subtext = _(op.subtext);
		if (op.data) op.data = applyLocale(op.data);
	});
}

function filterItems(items) {
	if (reorderSub().value) return items;
	return items.filter(({ id }) => {
		return !(id === "move-item:up" || id === "move-item:down");
	});
}

const normalizedOptions = computed(() => {
	const filtered = filterItems(props.options);
	const normalized = assignChecks(filtered);
	applyLocale(normalized);
	return normalized;
});

const finalOptions = computed(() => {
	const opts = [];
	normalizedOptions.value.forEach(item => {
	    const data = dataSub().value;
		if (!data) return opts;

		switch (item.id) {
			case "move-item:up":
			case "move-item:down":
			case "paste-row": {
				if (!item.isDisabled) {
					opts.push(item);
					return;
				}

				const disabled = item.isDisabled(
					item.id === "paste-row"
						? props.api
						: selectedRowsSub().value,
					data
				);

				opts.push({
					...item,
					disabled,
				});
				break;
			}
			default: {
				opts.push(item);
				break;
			}
		}
	});
	return opts;
});

function getItem(id) {
	if (!selectedRowsSub().value.includes(id)) {
		props.api.exec("select-row", { id });
	}
	return id;
}

const resolverFn = computed(() => props.resolver ?? getItem);

const handleClicks = ev => {
	const option = ev.action;
	if (option) handleAction(props.api, option.id);
	props.onclick?.(ev);
};
</script>

<template>
	<ContextMenu
		:css="`wx-table-menu ${css}`"
		:at="at"
		:data-key="dataKey"
		:options="finalOptions"
		:resolver="resolverFn"
		:filter="filter"
		:onclick="handleClicks"
	>
		<slot />
	</ContextMenu>
</template>

<style scoped>
:global(.wx-menu .wx-option.wx-disabled) {
	pointer-events: none;
}
:global(.wx-menu .wx-option.wx-disabled .wx-value),
:global(.wx-menu .wx-option.wx-disabled .wx-icon) {
	color: var(--wx-color-font-disabled);
}
</style>
