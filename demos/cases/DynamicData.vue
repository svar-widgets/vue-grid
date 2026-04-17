<script setup>
import { nextTick, ref, inject } from "vue";

import { Slider, Button } from "@svar-ui/vue-core";
import { Grid } from "../../src";
import { repeatData, repeatColumns } from "../data";
import { timer, timerEnd } from "../custom/timers";

const helpers = inject("wx-helpers");

const data = ref([]);
let rawData = [];
const columns = ref([]);

const stats = ref(null);
const counter = ref(1);
const rowCount = ref(1000);
const columnCount = ref(100);
const requestRange = ref({ start: 0, end: 0 });

function genAndLoad() {
	timer("gen");
	stats.value = null;
	rawData = repeatData(+rowCount.value);
	columns.value = repeatColumns(+columnCount.value);
	counter.value += 1;
	const gen = timerEnd("gen");

	timer("render");
	nextTick().then(() => {
		setTimeout(() => {
			const render = timerEnd("render");
			const full = gen + render;
			stats.value = { gen, render, full };
		}, 1);
	});
}

genAndLoad();

function dataProvider(ev) {
	const { row } = ev;

	if (row.start)
		//mute notice for 1st request for testing purposes
		helpers.showNotice({
			text: `Request data: ${row.start} - ${row.end}`,
		});
	if (row) {
		data.value = rawData.slice(row.start, row.end);
		requestRange.value = row;
	}
}

function init(api) {
	api.on("move-item", ev => {
		const { id, target, mode } = ev;
		const index = rawData.findIndex(el => el.id === id);
		const targetIndex = rawData.findIndex(el => el.id === target);
		rawData.splice(
			mode === "before" ? targetIndex : targetIndex + 1,
			0,
			rawData.splice(index, 1)[0]
		);

		if (data.value.findIndex(el => el.id === id) === -1) {
			// update visible range in case the item is not present there
			data.value = rawData.slice(requestRange.value.start, requestRange.value.end);
		}
	});
}
</script>

<template>
	<div style="padding: 20px;">
		<h4>Load data in portions during scroll</h4>

		<div style="width: 320px; padding-bottom: 20px;">
			<Slider
				:label="`Rows: ${rowCount}`"
				:min="2"
				:max="200000"
				v-model:value="rowCount"
			/>
		</div>
		<div style="width: 320px; padding-bottom: 20px;">
			<Slider
				:label="`Columns: ${columnCount}`"
				:min="2"
				:max="20000"
				v-model:value="columnCount"
			/>
		</div>
		<div style="width: 320px; padding-bottom: 20px;">
			<Button type="primary" :onclick="genAndLoad">
				Generate data and load
			</Button>
		</div>
		<div style="width: 1000px; height: 600px;">
			<Grid
				:key="counter"
				:init="init"
				:data="data"
				:columns="columns"
				:dynamic="{ rowCount, columnCount }"
				@request-data="dataProvider"
				reorder
			/>
		</div>
		<pre v-if="stats">
{{ rowCount }} rows, {{ columnCount }} columns, {{ rowCount * columnCount }} cells
dataset generation: {{ stats.gen }}ms
dataset rendering: {{ stats.render }}ms</pre>
	</div>
</template>
