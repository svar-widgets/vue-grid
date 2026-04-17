<script setup>
import { ref } from "vue";
import { Grid } from "../../src";
import { getData } from "../data";
import { Button } from "@svar-ui/vue-core";

const { data } = getData();
const api = ref(null);

const columnsCustomSort = [
	{ id: "id", width: 50, sort: true },
	{ id: "city", header: "City", width: 160, sort: true },
	{
		id: "street",
		header: "Street",
		width: 200,
		sort: (a, b) => {
			return a.zipCode.localeCompare(b.zipCode);
		},
		template: (value, row) => `${row.street}, ${row.zipCode}`,
	},
	{ id: "firstName", header: "First Name", sort: true },
	{ id: "lastName", header: "Last Name", sort: true },
];

const columnsSort = [
	{ id: "id", width: 50, sort: false },
	{ id: "city", header: "City", width: 160, sort: true },
	{ id: "firstName", header: "First Name", sort: true },
	{ id: "lastName", header: "Last Name", sort: true },
];
const sortMarks = ref(undefined);
function onclick() {
	sortMarks.value = {
		lastName: {
			order: sortMarks.value?.lastName?.order === "asc" ? "desc" : "asc",
		},
	};

	api.value.exec("sort-rows", {
		sort: (a, b) => {
			return sortMarks.value?.lastName?.order === "asc"
				? a.lastName.localeCompare(b.lastName)
				: -a.lastName.localeCompare(b.lastName);
		},
	});
}
</script>

<template>
	<div class="demo-container">
		<div>
			<h4>Custom sorting function can be specified in columns config</h4>
			<Grid :data="data" :columns="columnsCustomSort" />
		</div>
		<div>
			<h4>Sorting via sort-rows action call</h4>
			<Button :onclick="onclick" css="demo-button-sort" type="primary">
				Click to sort by last name
			</Button>

			<Grid :data="data" ref="api" :sort-marks="sortMarks" :columns="columnsSort" />
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
