<script setup>
import { ref } from "vue";
import { Field, DateRangePicker, Text } from "@svar-ui/vue-core";
import { Grid } from "../../src";
import { getData } from "../data";

const { allData } = getData();

const columns = [
	{ id: "id", width: 50 },
	{
		id: "firstName",
		header: "First Name",
		footer: "First Name",
	},
	{
		id: "lastName",
		header: "Last Name",
		footer: "Last Name",
	},
	{
		id: "date",
		header: "Date",
		template: v => v.toDateString(),
		width: 160,
	},
	{
		id: "companyName",
		header: "Company",
		flexgrow: 1,
	},
];

let tableApi = null;
const dateValue = ref(undefined);
const companyValue = ref("");

function init(api) {
	tableApi = api;
}

function handleFilter() {
	const filterValues = {
		date: dateValue.value,
		companyName: companyValue.value,
	};

	const filter = createFilter(filterValues);
	tableApi.exec("filter-rows", { filter });
}

function createFilter(filterValues) {
	const filters = Object.keys(filterValues)
		.filter(key => filterValues[key])
		.map(key => {
			const value = filterValues[key];

			switch (key) {
				case "companyName": {
					return v => {
						if (v[key])
							return (
								v[key]
									.toLowerCase()
									.indexOf(value.toLowerCase()) !== -1
							);
					};
				}
				case "date": {
					return v => {
						if (v[key]) return isDateInRange(v[key], value);
					};
				}
			}
		});

	return obj => {
		for (let i = 0; i < filters.length; i++) {
			if (!filters[i](obj)) {
				return false;
			}
		}
		return true;
	};
}

function isDateInRange(date, range) {
	const { start, end } = range;
	const nDate = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	);

	return nDate >= start && nDate <= end;
}
</script>

<template>
	<div class="demo" style="padding: 20px;">
		<h4>Grid with external filters</h4>
		<div style="max-width: 810px;">
			<div class="controls">
				<Field :label="'Filter &quot;Date&quot; column'">
					<DateRangePicker
						v-model:value="dateValue"
						:clear="true"
						:onchange="handleFilter"
					/>
				</Field>
				<Field :label="'Filter &quot;Company&quot; column'">
					<Text
						v-model:value="companyValue"
						:clear="true"
						icon="wxi-search"
						:onchange="handleFilter"
					/>
				</Field>
			</div>
			<div style="height: 400px;">
				<Grid :data="allData" :columns="columns" :init="init" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.controls {
	display: flex;
	gap: 10px;
}
</style>
