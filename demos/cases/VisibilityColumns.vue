<script setup>
import { ref } from "vue";
import { getData } from "../data";
import { Grid, HeaderMenu } from "../../src/";

const { data } = getData();

const columns = [
	{ id: "id", width: 50 },
	{ id: "city", header: "City", width: 160, hidden: true },
	{ id: "firstName", header: "First Name", flexgrow: 1 },
	{ id: "lastName", header: "Last Name", flexgrow: 1 },
	{ id: "companyName", header: "Company", flexgrow: 1 },
];
const api = ref(null);

const columns1 = [
	{ id: "id", width: 50 },
	{
		id: "lastName",
		header: "Last Name",
		footer: "Last Name",
		width: 150,
	},
	{ id: "email", header: "Email", footer: "Email" },
	{
		id: "companyName",
		header: "Company",
		footer: "Company",
		flexgrow: 1,
	},
	{ id: "city", header: "City", width: 160, hidden: true },
	{ id: "stars", header: "Stars" },
];
const api1 = ref(null);
</script>

<template>
	<div style="padding: 20px">
		<h4>
			Any column can be hidden: right-click on the header to show the
			menu
		</h4>
		<div>
			<HeaderMenu :api="api">
				<Grid :data="data" :columns="columns" ref="api" />
			</HeaderMenu>
		</div>

		<h4>
			Some columns can be hidden: right-click on the header to show the
			menu
		</h4>
		<div>
			<HeaderMenu
				:columns="{ city: true, stars: true }"
				:api="api1"
			>
				<Grid :data="data" :columns="columns1" ref="api1" />
			</HeaderMenu>
		</div>
	</div>
</template>
