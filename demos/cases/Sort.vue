<script setup>
defineOptions({ name: "DemoSort" });
import { Grid } from "../../src";
import { getData } from "../data";

const { data } = getData();
const columns = [
	{ id: "id", width: 50, sort: true },
	{ id: "city", header: "City", width: 160, sort: true },
	{ id: "email", header: "Email", width: 250, sort: true },
	{ id: "firstName", header: "First Name", sort: true },
	{ id: "lastName", header: "Last Name", sort: true },
];

const columnsSortOnUpdate = [
	{ id: "id", width: 50, sort: true },
	{ id: "city", header: "City", width: 160, sort: true, editor: "text" },
	{ id: "firstName", header: "First Name", sort: true, editor: "text" },
	{ id: "lastName", header: "Last Name", sort: true, editor: "text" },
];

function init(api) {
	api.on("update-cell", () => {
		const marks = api.getState().sortMarks;
		for (let key in marks) {
			api.exec("sort-rows", {
				key,
				order: marks[key].order,
				add: marks[key].index ?? true,
			});
		}
	});
}
</script>

<template>
	<div class="demo-container">
		<div>
			<h4>Click on header cells to sort the data</h4>
			<Grid :data="data" :columns="columns" />
		</div>
		<div>
			<h4>Resort data after editing a cell</h4>
			<Grid :data="data" :init="init" :columns="columnsSortOnUpdate" />
		</div>
	</div>
</template>

<style scoped>
.demo-container {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 20px;
}
:global(.demo-button-sort) {
	margin-bottom: 16px;
}
</style>
