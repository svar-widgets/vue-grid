<script setup>
defineOptions({ name: "GridToolbar" });

import { computed, inject } from "vue";
import { subscribeLater } from "@svar-ui/lib-vue";
import { Toolbar } from "@svar-ui/vue-toolbar";
import {
	defaultToolbarButtons,
	assignChecks,
	handleAction,
} from "@svar-ui/grid-store";
import { locale } from "@svar-ui/lib-dom";
import { en } from "@svar-ui/grid-locales";

const props = defineProps({
	api: {},
	items: { default: () => [...defaultToolbarButtons] },
	onclick: { type: Function },
});

const i18n = inject("wx-i18n", null);
const _ = i18n?.getGroup("grid") || locale(en).getGroup("grid");

const selectedRowsSub = subscribeLater(() => props.api?.getReactiveState()?.selectedRows);
const dataSub = subscribeLater(() => props.api?.getReactiveState()?.data);
const historySub = subscribeLater(() => props.api?.getReactiveState()?.history);
const reorderSub = subscribeLater(() => props.api?.getReactiveState()?.reorder);
const undoSub = subscribeLater(() => props.api?.getReactiveState()?.undo);

const rowActions = [
	"open-editor",
	"delete-row",
	"copy-row",
	"cut-row",
	"paste-row",
	"move-item:up",
	"move-item:down",
];
const historyActions = ["undo", "redo"];

function applyLocale(options) {
	options.forEach(op => {
		if (op.text) op.text = _(op.text);
		if (op.menuText) op.menuText = _(op.menuText);
		if (op.items) op.items = applyLocale(op.items);
	});
}

function filterItems(items) {
    const undoVal = undoSub();
    const reorderVal = reorderSub();
	if (undoVal.value && reorderVal.value) return items;
	return items.filter(({ id }) => {
		return !(
			(!undoVal.value && (id === "undo" || id === "redo")) ||
			(!reorderVal.value &&
				(id === "move-item:up" || id === "move-item:down"))
		);
	});
}

const normalizedItems = computed(() => {
	const filtered = filterItems(props.items);
	const normalized = assignChecks(filtered);
	applyLocale(normalized);
	return normalized;
});

const buttons = computed(() => {
    if (!props.api) return [];
    const selectedRowsVal = selectedRowsSub();

	const finalButtons = [];
	const selected = selectedRowsVal.value?.length;
	normalizedItems.value.forEach(item => {
		const action = item.id;
		if (action === "add-row") {
			finalButtons.push(item);
		} else if (rowActions.includes(action)) {
			if (!selected) return;
			finalButtons.push({
				...item,
				disabled:
					item.isDisabled &&
					item.isDisabled(
						action === "paste-row"
							? props.api
							: selectedRowsVal.value,
						dataSub().value
					),
			});
		} else if (historyActions.includes(action)) {
			finalButtons.push({
				...item,
				disabled: item.isDisabled(historySub().value),
			});
		} else {
			finalButtons.push(item);
		}
	});
	return finalButtons;
});

const handleClicks = ev => {
	const option = ev.item;
	if (option) handleAction(props.api, option.id);
	props.onclick && props.onclick(ev);
};
</script>

<template>
	<Toolbar :items="buttons" :onclick="handleClicks" v-bind="$attrs" />
</template>
