<script setup>
import { ref } from "vue";
import { Grid } from "../../src";
import { Button, Field, RadioButtonGroup } from "@svar-ui/vue-core";
import { repeatData, repeatColumns } from "../data";

const data = repeatData(100);
const columns = repeatColumns(20);

const mode = ref("portrait");
const paper = ref("a4");

const modes = [
	{ id: "portrait", label: "Portrait" },
	{ id: "landscape", label: "Landscape" },
];
const papers = [
	{ id: "a3", label: "a3" },
	{ id: "a4", label: "a4" },
	{ id: "letter", label: "letter" },
];

const api = ref(null);

function printGrid() {
	api.value.exec("print", { mode: mode.value, paper: paper.value });
}
</script>

<template>
	<div class="demo" style="padding: 20px;">
		<div class="config">
			<Field label="Mode" position="left" type="checkbox">
				<RadioButtonGroup :options="modes" type="inline" v-model:value="mode" />
			</Field>
			<Field label="Paper" position="left" type="checkbox">
				<RadioButtonGroup
					:options="papers"
					type="inline"
					v-model:value="paper"
				/>
			</Field>
		</div>
		<h4>Print grid</h4>
		<div>
			<Button :onclick="printGrid" type="primary">Print Grid</Button>
		</div>
		<div style="height: 400px; margin-top: 10px;">
			<Grid ref="api" :data="data" :columns="columns" />
		</div>
	</div>
</template>

<style scoped>
.config {
	display: flex;
}
.config :deep(.wx-field) {
	width: fit-content;
}
</style>
