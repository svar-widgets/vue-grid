<script setup>
import { ref } from "vue";
import { Button } from "@svar-ui/vue-core";
import { RestDataProvider } from "@svar-ui/grid-data-provider";
import { Grid } from "../../src/";

const columns = [
	{
		id: "name",
		header: "Title",
		flexgrow: 1,
		sort: true,
		editor: "text",
	},
	{
		id: "year",
		header: "Year",
		width: 100,
		sort: true,
		editor: "text",
	},
	{
		id: "votes",
		header: "Votes",
		width: 100,
		sort: true,
		editor: "text",
	},
];
const data = ref([]);
const provider = new RestDataProvider(
	"https://grid-backend.svar.dev/films",
	obj => {
		obj.year = obj.year * 1;
		obj.votes = obj.votes * 1;
	}
);
provider.getData().then(v => (data.value = v));

const api = ref(null);
const deleteRow = () => {
	const id = api.value.getState().selectedRows[0];
	if (id) {
		api.value.exec("delete-row", { id });
	}
};
const addRow = () => {
	api.value.exec("add-row", {
		row: { name: "New Film", year: "2022", votes: 1 },
	});
};
const init = api => {
	api.setNext(provider);
};
</script>

<template>
	<div style="padding: 20px; height: 600px">
		<div style="padding-bottom: 10px">
			<Button :onclick="addRow" type="primary">Add row</Button>
			<Button :onclick="deleteRow">Delete row</Button>
		</div>

		<Grid ref="api" :data="data" :columns="columns" :init="init" />
	</div>
</template>
