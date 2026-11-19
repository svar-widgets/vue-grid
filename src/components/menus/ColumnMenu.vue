<script setup>
import { ref, computed, inject, provide } from "vue";
import { subscribeLater } from "@svar-ui/lib-vue";
import { ActionMenu, registerMenuItem } from "@svar-ui/vue-menu";
import {
	defaultColumnMenuOptions,
	assignChecks,
	handleAction,
} from "@svar-ui/grid-store";
import HeaderMenuItem from "./HeaderMenuItem.vue";

import { locale } from "@svar-ui/lib-dom";
import { en } from "@svar-ui/grid-locales";

registerMenuItem("columns-submenu", HeaderMenuItem);

const props = defineProps({
	api: {},
	options: { default: () => [...(defaultColumnMenuOptions || [])] },
	at: { default: "point" },
	columns: { type: Object, default: null },
	resolver: { type: Function, default: undefined },
	onclick: { type: Function },
});

function getLabel(col) {
	for (let i = col.header.length - 1; i >= 0; i--) {
		const text = col.header[i].text;
		if (text) return text;
	}
	return col.id;
}

const i18n = inject("wx-i18n", null);
const _ = i18n?.getGroup("grid") || locale(en).getGroup("grid");

// mutates in place - only call on fresh copies produced by assignChecks
function applyLocale(options) {
	options.forEach(op => {
		if (op.text) op.text = _(op.text);
		if (op.subtext) op.subtext = _(op.subtext);
		if (op.data) {
			applyLocale(op.data);
		}
	});
}

const columnId = ref();

const sortMarksSub = subscribeLater(
	() => props.api?.getReactiveState()?.sortMarks
);
const splitSub = subscribeLater(() => props.api?.getReactiveState()?.split);
const columnsSub = subscribeLater(
	() => props.api?.getReactiveState()?._columns
);

provide("grid-column-menu", {
	get menuColumns() {
		return props.columns;
	},
});

function open(id) {
	columnId.value = id;
	return id;
}

const resolverFn = computed(() => props.resolver ?? open);

const handleClicks = ev => {
	const option = ev.action;
	if (option) {
		if (option.comp === "columns-submenu") {
			handleAction(props.api, "hide-column", option.id);
		} else {
			handleAction(props.api, option.id, columnId.value);
		}
	}
	props.onclick?.(ev);
};

function filterItems(items) {
	const sortOrder = sortMarksSub().value?.[columnId.value]?.order;
	// always return a new array, so the caller's options are never mutated
	if (!sortOrder) return [...items];

	return items.filter(item => {
		if (item.id === "sort-column:asc" && sortOrder === "asc") return false;
		if (item.id === "sort-column:desc" && sortOrder === "desc")
			return false;
		return true;
	});
}

const normalizedOptions = computed(() => {
	const filtered = filterItems(props.options || []);
	const submenuIdx = filtered.findIndex(opt => opt.id === "show-columns");
	if (submenuIdx !== -1) {
		const cols = columnsSub().value || [];
		filtered[submenuIdx] = {
			...filtered[submenuIdx],
			data: cols.map(c => ({
				id: c.id,
				text: getLabel(c),
				type: "columns-submenu",
				hidden: c.hidden,
			})),
		};
	}

	// assignChecks returns shallow copies (including nested data),
	// so applyLocale localizes copies, not the source options
	const normalized = assignChecks(filtered);
	applyLocale(normalized);
	return normalized;
});

const finalOptions = computed(() => {
	const opts = [];
	const id = columnId.value;
	if (id) {
		const cols = columnsSub().value || [];
		const split = splitSub().value;
		normalizedOptions.value.forEach(item => {
			if (!item.isDisabled) {
				opts.push(item);
				return;
			}
			const disabled = item.isDisabled(id, cols, split);
			opts.push({
				...item,
				disabled,
			});
		});
	}
	return opts;
});
</script>

<template>
	<ActionMenu
		data-key="columnId"
		:options="finalOptions"
		:at="at"
		:resolver="resolverFn"
		:onclick="handleClicks"
	>
		<slot />
	</ActionMenu>
</template>
