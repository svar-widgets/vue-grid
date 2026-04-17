<script setup>
import { ref } from "vue";
import { Tabs } from "@svar-ui/vue-core";
import { FilterBar, createFilter, getOptions } from "@svar-ui/vue-filter";

import { Grid } from "../../src";
import { getData } from "../data";
const { data, columns } = getData();

const api = ref(null);

const filterId = ref(1);
const filterTabs = [
	{ id: 1, label: "By all" },
	{ id: 2, label: "By city" },
	{ id: 3, label: "By the field" },
];

const cities = getOptions(data, "city");

function handleValueChange({ value }) {
	const filter = createFilter(value);
	api.value.exec("filter-rows", { filter });
}

function handleFilterChange({ value }) {
	filterId.value = value;
	api.value.exec("filter-rows", { filter: null });
}
</script>

<template>
	<div style="padding: 20px;">
		<h4>Filter grid data executing "filter-rows" action</h4>

		<Tabs :value="filterId" :options="filterTabs" :onchange="handleFilterChange" />

		<FilterBar
			v-if="filterId === 1"
			:fields="[
				{
					type: 'all',
					by: ['id', 'city', 'firstName', 'lastName', 'email'],
				},
			]"
			:onchange="handleValueChange"
		/>
		<FilterBar
			v-else-if="filterId === 2"
			:fields="[
				{
					type: 'text',
					id: 'city',
					options: cities,
				},
			]"
			:onchange="handleValueChange"
		/>
		<FilterBar
			v-else-if="filterId === 3"
			:fields="[
				{
					type: 'dynamic',
					by: ['city', 'firstName', 'lastName', 'email'],
				},
			]"
			:onchange="handleValueChange"
		/>

		<Grid :data="data" :columns="columns" ref="api" />
	</div>
</template>
