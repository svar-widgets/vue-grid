<script setup>
import { ref, watchEffect } from "vue";
import { FilterBuilder, createFilter, getOptions } from "@svar-ui/vue-filter";

import { getData } from "../data";
import { Grid } from "../../src";

const { data, columns } = getData();
columns.push({ id: "comments", flexgrow: 1, header: "Comments" });
const value = {
	glue: "or",
	rules: [
		{
			field: "city",
			filter: "equal",
			value: "Eulaliabury",
		},
		{
			field: "city",
			filter: "equal",
			value: "West Meda",
		},
	],
};

const api = ref(null);

let options = {
	city: getOptions(data, "city"),
	firstName: getOptions(data, "firstName"),
	lastName: getOptions(data, "lastName"),
	email: getOptions(data, "email"),
};

let fields = [
	{ id: "city", label: "City", type: "text" },
	{ id: "firstName", label: "Name", type: "text" },
	{ id: "lastName", label: "Last Name", type: "text" },
	{ id: "email", label: "Email", type: "text" },
];

function applyFilter({ value }) {
	const filter = createFilter(value);
	api.value.exec("filter-rows", { filter });
}

watchEffect(() => {
	if (api.value) applyFilter({ value });
});
</script>

<template>
	<div style="padding: 20px;">
		<h4>Filter grid data executing "filter-rows" action</h4>
		<FilterBuilder
			:value="value"
			:fields="fields"
			:options="options"
			type="line"
			:onchange="applyFilter"
		/>

		<Grid :data="data" :columns="columns" ref="api" />
	</div>
</template>
