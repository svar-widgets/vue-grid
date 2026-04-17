<script setup>
import { inject, ref } from "vue";
import { Grid } from "../../src";
import { ActionMenu } from "@svar-ui/vue-menu";

import { getData } from "../data";

import ButtonCell from "../custom/ButtonCell.vue";
import CheckboxCell from "../custom/CheckboxCell.vue";
import IconCell from "../custom/IconCell.vue";
import HeaderCheckboxCell from "../custom/HeaderCheckboxCell.vue";
import HeaderButtonCell from "../custom/HeaderButtonCell.vue";

const helpers = inject("wx-helpers");
let { data } = getData();
data = ref(data);
const api = ref(null);

const columns = [
	{
		id: "menu",
		cell: IconCell,
		header: [{ cell: HeaderButtonCell }],
		width: 134,
	},
	{
		id: "checked",
		cell: CheckboxCell,
		header: [{ cell: HeaderCheckboxCell }],
		width: 36,
	},
	{ id: "firstName", header: "First Name", editor: "text" },
	{ id: "lastName", header: "Last Name", editor: "text" },
	{ id: "email", header: "Email", editor: "text" },
	{
		id: "city",
		header: "City",
		cell: ButtonCell,
		editor: "text",
		width: 260,
	},
];

const options = [
	{
		id: "add-row:before",
		text: "Add before",
		icon: "wxi-table-row-plus-before",
	},
	{
		id: "add-row:after",
		text: "Add after",
		icon: "wxi-table-row-plus-after",
	},
	{
		id: "duplicate-row",
		text: "Duplicate",
		icon: "wxi-duplicate",
	},
	{
		id: "delete-row",
		text: "Delete",
		icon: "wxi-delete-outline",
	},
];

function action(action, ev) {
	const { row, column, value } = ev;
	const event = `Event: ${action}\n`;
	const val = `value: ${value}\n`;
	const r = `Row ID: ${row}\n`;
	const c = `Col ID: ${column}\n`;

	helpers.showNotice({
		text: event + (action === "header-checkbox" ? val : r + c),
	});

	if (action === "header-checkbox") onHeaderCheck(ev);
}

function onHeaderCheck(ev) {
	const { value, eventSource } = ev;

	if (eventSource == "click") {
		data.value = api.value.getState().data.map(d => {
			d.checked = value;
			return d;
		});
	}
}

const handleClicks = ev => {
	const option = ev.action;
	if (option) {
		const id = api.value.getState().selectedRows[0];
		switch (option.id) {
			case "add-row:before":
				api.value.exec("add-row", { row: {}, before: id });
				break;
			case "add-row:after":
				api.value.exec("add-row", { row: {}, after: id });
				break;
			case "duplicate-row":
				api.value.exec("add-row", {
					row: { ...api.value.getRow(id), id: null },
					after: id,
				});
				break;
			case "delete-row":
				api.value.exec("delete-row", { id });
				break;
		}
	}
};
</script>

<template>
	<div class="demo" style="padding: 20px">
		<ActionMenu
			:resolver="id => id"
			at="point"
			data-key="actionId"
			:options="options"
			:onclick="handleClicks"
		>
			<Grid
				ref="api"
				:cell-style="(row, col) => (col.id == 'city' ? 'button_cell' : '')"
				:data="data"
				:columns="columns"
				@custom-button="ev => action('button', ev)"
				@custom-icon="ev => action('icon', ev)"
				@custom-check="ev => action('checkbox', ev)"
				@custom-header-check="ev => action('header-checkbox', ev)"
			/>
		</ActionMenu>
	</div>
</template>

<style scoped>
.demo :deep(.button_cell) {
	padding: 2px 8px;
}
.demo :deep(.button_cell button) {
	float: right;
}
</style>
