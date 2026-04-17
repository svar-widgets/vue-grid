<script setup>
import { inject, ref } from "vue";
import { getData } from "../data";
import { Grid } from "../../src/";
import { ContextMenu } from "@svar-ui/vue-menu";

const { data, flexibleColumns: columns } = getData();

const options = [
	{
		id: "add",
		text: "Add before",
		icon: "wxi-table-row-plus-before",
	},
	{ id: "duplicate", text: "Duplicate", icon: "wxi-duplicate" },
	{ id: "delete", text: "Delete", icon: "wxi-delete-outline" },
	{ comp: "separator" },
	{ id: "info", text: "Info", icon: "wxi-alert" },
	{ id: "view", text: "View", icon: "wxi-external" },
];

const helpers = inject("wx-helpers");
const table = ref(null);

const handleClicks = ev => {
	const option = ev.action;
	if (option) {
		const id = table.value.getState().selectedRows[0];
		switch (option.id) {
			case "add":
				table.value.exec("add-row", { row: {}, before: id });
				break;
			case "duplicate":
				table.value.exec("add-row", {
					row: { ...table.value.getRow(id), id: null },
					after: id,
				});
				break;
			case "delete":
				table.value.exec("delete-row", { id });
				break;
			default:
				helpers.showNotice({ text: `You clicked ${option.text}` });
		}
	}
};

function getItem(id) {
	if (id) table.value.exec("select-row", { id });
	return id;
}
</script>

<template>
	<div style="padding: 20px">
		<h4>Context menu with custom actions</h4>
		<ContextMenu
			:options="options"
			:onclick="handleClicks"
			at="point"
			:resolver="getItem"
		>
			<Grid :data="data" :columns="columns" ref="table" />
		</ContextMenu>
	</div>
</template>
