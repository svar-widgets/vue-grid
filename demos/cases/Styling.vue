<script setup>
defineOptions({ name: "DemoStyling" });
import { ref } from "vue";
import { getData, repeatColumns } from "../data";
import { Button } from "@svar-ui/vue-core";
import { Grid } from "../../src/";

const { data } = getData();
const columns = repeatColumns(50);

const cellStyle = ref(undefined);
let i = 0;
function setCellStyle() {
	let id = data[i].id;
	cellStyle.value = (row, col) =>
		row.id == id && col.id == "lastName" ? "cellStyle" : "";
	i = i == data.length - 1 ? 0 : i + 1;
}
</script>

<template>
	<div style="padding: 20px">
		<p>
			<Button type="primary" :onclick="() => setCellStyle()">
				Set cell style
			</Button>
		</p>
		<div>
			<Grid
				:data="data"
				:columns="columns"
				:cell-style="cellStyle"
				:row-style="row => (row.id == 12 ? 'rowStyle' : '')"
				:column-style="col => (col.id == 'city' ? 'columnStyle' : '')"
				:footer="true"
			/>
		</div>
	</div>
</template>

<style>
.rowStyle:not(.wx-selected) .wx-cell:not(.cellStyle) {
	color: white;
	background: #457b9d;
}
.columnStyle {
	text-decoration: underline;
}
.wx-row:not(.wx-selected) .cellStyle {
	color: white;
	background: rgba(82, 179, 163, 0.8);
}
</style>
