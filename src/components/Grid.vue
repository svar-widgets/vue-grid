<script setup>
defineOptions({ name: "GridGrid" });

import { ref, computed, inject, provide, watchEffect } from "vue";

// core widgets lib
import { Locale } from "@svar-ui/vue-core";
import { en } from "@svar-ui/grid-locales";

// stores
import { EventBusRouter } from "@svar-ui/lib-state";
import { DataStore } from "@svar-ui/grid-store";

// writable factory for Vue
import { writable } from "@svar-ui/lib-vue";

// ui
import Layout from "./Layout.vue";

const props = defineProps({
	data: { default: () => [] },
	columns: { default: () => [] },
	rowStyle: { default: null },
	columnStyle: { default: null },
	cellStyle: { default: null },
	selectedRows: { default: () => [] },
	select: { type: Boolean, default: true },
	multiselect: { type: Boolean, default: false },
	header: { type: Boolean, default: true },
	footer: { type: Boolean, default: false },
	dynamic: { default: null },
	overlay: { default: null },
	reorder: { type: Boolean, default: false },
	onreorder: { type: Function, default: null },
	autoRowHeight: { type: Boolean, default: false },
	sizes: { default: () => ({}) },
	split: { default: () => ({ left: 0 }) },
	tree: { type: Boolean, default: false },
	autoConfig: { type: [Boolean, Object], default: false },
	init: { type: Function, default: null },
	responsive: { default: null },
	sortMarks: { default: () => ({}) },
	undo: { type: Boolean, default: false },
	hotkeys: { default: null },
	filterValues: { default: () => ({}) },
});

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();

const clientWidth = ref(0);
const clientHeight = ref(0);
const responsiveLevel = ref(null);
const responsiveConfig = ref(null);

// init stores
const dataStore = new DataStore(writable);

// define event route
let firstInRoute = dataStore.in;

let lastInRoute = new EventBusRouter((a, b) => {
	emit(a, b);
});
firstInRoute.setNext(lastInRoute);

// public API
const getState = dataStore.getState.bind(dataStore);
const getReactiveState = dataStore.getReactive.bind(dataStore);
const getStores = () => ({ data: dataStore });
const exec = firstInRoute.exec.bind(firstInRoute);
const setNext = (ev) => (lastInRoute = lastInRoute.setNext(ev));
const intercept = firstInRoute.intercept.bind(firstInRoute);
const on = firstInRoute.on.bind(firstInRoute);
const detach = firstInRoute.detach.bind(firstInRoute);
const getRow = (id) => dataStore.getRow(id);
const getColumn = (id) => dataStore.getColumn(id);

const api = {
	exec,
	setNext,
	intercept,
	on,
	detach,
	getRow,
	getColumn,
	getState,
	getReactiveState,
	getStores,
};

// common API available in components
provide("grid-store", {
	getState: dataStore.getState.bind(dataStore),
	getReactiveState: dataStore.getReactive.bind(dataStore),
	exec: firstInRoute.exec.bind(firstInRoute),
	getRow: dataStore.getRow.bind(dataStore),
	getRowIndex: dataStore.getRowIndex.bind(dataStore),
});

// auto config columns
const finalColumns = computed(() => {
	if (props.autoConfig && !props.columns.length && props.data.length) {
		const test = props.data[0];
		const autoCols = [];

		for (let key in test) {
			if (key !== "id" && key[0] !== "$") {
				let col = {
					id: key,
					header: key[0].toUpperCase() + key.slice(1),
				};

				if (typeof props.autoConfig === "object") {
					col = { ...col, ...props.autoConfig };
				}
				autoCols.push(col);
			}
		}

		return autoCols;
	}

	return responsiveConfig.value?.columns ?? props.columns;
});

const finalSizes = computed(
	() => responsiveConfig.value?.sizes ?? props.sizes
);

function resize(rect) {
	clientWidth.value = rect.width;
	clientHeight.value = rect.height;

	if (props.responsive) {
		const levels = Object.keys(props.responsive)
			.map(Number)
			.sort((a, b) => a - b);

		const newLevel =
			levels.find((level) => clientWidth.value <= level) ?? null;

		if (newLevel !== responsiveLevel.value) {
			responsiveConfig.value = props.responsive[newLevel];
			responsiveLevel.value = newLevel;
		}
	}
}

const _skin = inject("wx-theme", undefined);

let init_once = true;

const reinitStore = () => {
	dataStore.init({
		data: props.data,
		columns: finalColumns.value,
		split: props.split,
		sizes: finalSizes.value,
		selectedRows: props.selectedRows,
		dynamic: props.dynamic,
		tree: props.tree,
		sortMarks: props.sortMarks,
		filterValues: props.filterValues,
		select: props.select,
		undo: props.undo,
		reorder: props.reorder,
		_skin,
	});

	if (init_once && props.init) {
		props.init(api);
		init_once = false;
	}
};

reinitStore();
watchEffect(reinitStore);

defineExpose({
	exec,
	setNext,
	intercept,
	on,
	detach,
	getRow,
	getColumn,
	getState,
	getReactiveState,
	getStores,
});
</script>

<template>
	<Locale :words="en" :optional="true">
		<Layout
			:header="header"
			:footer="footer"
			:overlay="overlay"
			:row-style="rowStyle"
			:column-style="columnStyle"
			:cell-style="cellStyle"
			:onreorder="onreorder"
			:multiselect="multiselect"
			:auto-row-height="autoRowHeight"
			:client-width="clientWidth"
			:client-height="clientHeight"
			:responsive-level="responsiveLevel"
			:resize="resize"
			:hotkeys="hotkeys"
		/>
	</Locale>
</template>
