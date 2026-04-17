<script setup>
defineOptions({ name: "DemoToolbar" });
import { ref } from "vue";
import { getData } from "../data";
import { Grid, Toolbar } from "../../src";

const { data, countries } = getData();
const api = ref(null);

const columns = [
	{ id: "id", width: 50 },
	{
		id: "firstName",
		header: "First Name",
		editor: "text",
		width: 160,
	},
	{
		id: "lastName",
		header: "Last Name",
		editor: "text",
		width: 160,
	},
	{
		id: "country",
		header: "Country",
		editor: "richselect",
		options: countries,
		width: 160,
	},
	{
		id: "date",
		header: "Date",
		width: 100,
		template: v => (v ? v.toLocaleDateString() : ""),
	},
	{
		id: "companyName",
		header: "Description",
		flexgrow: 1,
	},
];
</script>

<template>
	<div style="padding: 20px;">
		<Toolbar :api="api" />
		<Grid ref="api" :data="data" :columns="columns" reorder undo multiselect />
	</div>
</template>
