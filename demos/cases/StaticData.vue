<script setup>
import { nextTick, ref } from "vue";

import { Slider, Button } from "@svar-ui/vue-core";
import { Grid } from "../../src";
import { repeatData, repeatColumns } from "../data";
import { timer, timerEnd } from "../custom/timers";

let data = [];
let columns = [];

const stats = ref(null);
const counter = ref(1);
const rows = ref(1000);
const cols = ref(100);

function genAndLoad() {
	timer("gen");
	stats.value = null;
	data = repeatData(+rows.value);
	columns = repeatColumns(+cols.value);
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
</script>

<template>
	<div style="padding: 20px;">
		<h4>Load and render big data at once</h4>
		<div style="width: 320px; padding-bottom: 20px;">
			<Slider :label="`Rows: ${rows}`" :min="2" :max="200000" v-model:value="rows" />
		</div>
		<div style="width: 320px; padding-bottom: 20px;">
			<Slider :label="`Columns: ${cols}`" :min="2" :max="20000" v-model:value="cols" />
		</div>
		<div style="width: 320px; padding-bottom: 20px;">
			<Button type="primary" :onclick="genAndLoad">
				Generate data and load
			</Button>
		</div>
		<div style="width: 1000px; height: 600px;">
			<Grid :key="counter" :data="data" :columns="columns" :split="{ left: 1 }" />
		</div>
		<pre v-if="stats">
{{ rows }} rows, {{ cols }} columns, {{ rows * cols }} cells
dataset generation: {{ stats.gen }}ms
dataset rendering: {{ stats.render }}ms</pre>
	</div>
</template>
