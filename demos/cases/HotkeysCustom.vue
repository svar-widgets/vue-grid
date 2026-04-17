<script setup>
import { ref } from "vue";
import { Grid } from "../../src";
import { getData } from "../data";

const { allData: data, countries, users } = getData();
const api = ref(null);

const hotkeys = {
	"ctrl+alt+n": event => {
		event.preventDefault();
		api.value.exec("add-row", {
			row: {},
		});
	},
	Delete: event => {
		event.preventDefault();
		const id = api.value.getState().selectedRows[0];
		if (id) {
			api.value.exec("delete-row", { id });
		}
	},
};

const columns = [
	{
		id: "firstName",
		header: 'Name - "text"',
		editor: "text",
		width: 180,
	},
	{
		id: "country",
		header: 'Country - "combo"',
		editor: {
			type: "combo",
			config: { template: option => `${option.id}. ${option.label}` },
		},
		options: countries,
		width: 180,
	},
	{
		id: "date",
		header: 'Date - "datepicker"',
		width: 180,
		editor: "datepicker",
		template: v => (v ? v.toLocaleDateString() : ""),
	},
	{
		id: "user",
		header: 'User - "richselect"',
		width: 180,
		editor: "richselect",
		options: users,
	},
];
</script>

<template>
	<div style="padding: 20px">
		<h4>You can specify your own hotkeys</h4>
		<p>
			Press ctrl+alt+n to add row, select and press Delete to delete row
		</p>
		<div>
			<Grid
				ref="api"
				:data="data"
				:columns="columns"
				:hotkeys="hotkeys"
			/>
		</div>
	</div>
</template>
