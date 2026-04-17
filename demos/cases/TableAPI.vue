<script setup>
import { ref, inject } from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import { Grid } from "../../src";
import { Button } from "@svar-ui/vue-core";

import { getData } from "../data";
const { allData } = getData();

const data = ref(allData.slice(0, 10));

const otherData = allData.slice(0, 5);

const columns = [
	{
		id: "id",
		header: { rowspan: 2 },
		width: 50,
	},
	{
		id: "city",
		width: 100,
		header: { text: "City", rowspan: 2 },
		footer: "City",
		sort: true,
	},
	{
		id: "firstName",
		header: [
			{
				text: "First Name",
			},
			{ filter: "text" },
		],
		footer: "First Name",
		editor: "text",
		width: 150,
		sort: true,
	},
	{
		id: "lastName",
		header: [
			{
				text: "Last Name",
			},
			{ filter: "text" },
		],
		footer: "Last Name",
		editor: "text",
		width: 150,
		sort: true,
	},
	{
		id: "email",
		header: { text: "Email", rowspan: 2 },
		footer: "Email",
		sort: true,
	},
];

const helpers = inject("wx-helpers");

const tbl = ref(null);
const selected = ref(null);

function init(tbl) {
	const rState = tbl.getReactiveState();
	const selectedRows = subscribe(rState.selectedRows);

	selected.value = selectedRows.value?.[0];
	// The subscribe helper returns a Vue ref that updates automatically
}

function addRow() {
	tbl.value.exec("add-row", { row: {} });
}
function deleteRow() {
	const id = tbl.value.getState().selectedRows[0];
	if (id) {
		tbl.value.exec("delete-row", { id });
	}
}
function onSelectRow(ev) {
	helpers.showNotice({ text: "Selected: " + ev.id, type: "info" });
	selected.value = ev.id;
}
</script>

<template>
	<div style="padding: 20px">
		<p>
			<Button :onclick="addRow" type="primary">Add row</Button>
			<Button :onclick="deleteRow">Delete row</Button>
			<Button :onclick="() => (data = otherData)">Other Data</Button>
		</p>
		<div style="max-width: 800px">
			<Grid
				ref="tbl"
				:data="data"
				:columns="columns"
				:init="init"
				@select-row="onSelectRow"
			/>
		</div>
		<div class="status">Selected: {{ selected || "none" }}</div>
	</div>
</template>

<style scoped>
.status {
	padding: 6px 0;
}
</style>
