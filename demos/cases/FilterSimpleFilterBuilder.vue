<script setup>
import { ref } from "vue";
import {
	FilterBuilder,
	createArrayFilter,
	getOptions,
} from "@svar-ui/vue-filter";
import { getData } from "../data";
import { Grid } from "../../src";

const { data, columns } = getData();

let options = {
	city: getOptions(data, "city"),
	firstName: getOptions(data, "firstName"),
	lastName: getOptions(data, "lastName"),
	email: getOptions(data, "email"),
};

let fields = [
	{ id: "city", label: "City", type: "text" },
	{ id: "firstName", label: "First Name", type: "text" },
	{ id: "lastName", label: "Last Name", type: "text" },
	{ id: "email", label: "Email", type: "text" },
];

const value = {
	rules: [
		{
			field: "firstName",
			filter: "contains",
			value: "C",
		},
	],
};

const filteredData = ref([]);
applyFilter(value);

function applyFilter(value) {
	filteredData.value = createArrayFilter(value)(data);
}
</script>

<template>
	<div style="padding: 20px;">
		<h4>Filter data before parsing to Grid</h4>
		<FilterBuilder
			:value="value"
			type="simple"
			:fields="fields"
			:options="options"
			:onchange="ev => applyFilter(ev.value)"
		/>
		<Grid :data="filteredData" :columns="columns" />
	</div>
</template>
