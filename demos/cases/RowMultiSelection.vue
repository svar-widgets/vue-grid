<script setup>
import { ref } from "vue";
import { Grid } from "../../src";

import { getData } from "../data";
const { data } = getData();

const columns = [
	{ id: "id", width: 50 },
	{ id: "city", header: "City", width: 160 },
	{ id: "firstName", header: "First Name" },
	{ id: "lastName", header: "Last Name" },
	{ id: "companyName", header: "Company" },
];

const api = ref(null);
const s = ref([]);
const updateSelected = () => (s.value = api.value.getState().selectedRows);
</script>

<template>
	<div style="padding: 20px;">
		<h4>
			Click cells using Ctrl/Shift keys. Selected:
			{{ s.length ? s.join(", ") : "none" }}
		</h4>
		<div>
			<Grid
				:data="data"
				:columns="columns"
				:multiselect="true"
				ref="api"
				@select-row="updateSelected"
			/>
		</div>
	</div>
</template>
