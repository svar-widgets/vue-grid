<script setup>
import { ref, computed, watchEffect } from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import { getData } from "../data";
import { Grid, getEditorConfig } from "../../src";
import { Toolbar } from "@svar-ui/vue-toolbar";
import { Editor, registerEditorItem } from "@svar-ui/vue-editor";
import { RichSelect, DatePicker } from "@svar-ui/vue-core";

const { data, countries } = getData();
const api = ref(null);
const dataToEdit = ref(null);
const selectedRowsState = ref(null);
const historyState = ref(null);

function init(obj) {
	api.value = obj;
	const sr = subscribe(obj.getReactiveState().selectedRows);
	const hr = subscribe(obj.getReactiveState().history);
	watchEffect(() => {
		selectedRowsState.value = sr.value;
		historyState.value = hr.value;
	});

	api.value.intercept("open-editor", () => {
		return false;
	});
}

const columns = [
	{ id: "id", width: 50 },
	{
		id: "firstName",
		header: "First Name",
		editor: "text",
		width: 160,
	},
	{
		id: "lastName",
		header: "Last Name",
		editor: "text",
		width: 160,
	},
	{
		id: "country",
		header: "Country",
		editor: "richselect",
		options: countries,
		width: 160,
	},
	{
		id: "date",
		header: "Date",
		width: 100,
		editor: "datepicker",
		template: v => (v ? v.toLocaleDateString() : ""),
	},
	{
		id: "companyName",
		header: "Description",
		editor: "textarea",
		flexgrow: 1,
	},
];

registerEditorItem("richselect", RichSelect);
registerEditorItem("datepicker", DatePicker);

function onClick(item) {
	switch (item.id) {
		case "add-before": {
			const { selectedRows, data } = api.value.getState();
			const id = selectedRows[0];
			if (id) api.value.exec("add-row", { row: {}, before: id });
			else if (data.length)
				api.value.exec("add-row", { row: {}, before: data[0].id });
			break;
		}
		case "add-after": {
			const id = api.value.getState().selectedRows[0];
			if (id) api.value.exec("add-row", { row: {}, after: id });
			else api.value.exec("add-row", { row: {} });
			break;
		}
		case "delete": {
			const id = api.value.getState().selectedRows[0];
			if (id) api.value.exec("delete-row", { id });
			break;
		}
		case "edit": {
			const id = api.value.getState().selectedRows[0];
			if (id) dataToEdit.value = api.value.getRow(id);
			break;
		}
		case "undo":
			api.value.exec("undo");
			break;
		case "redo":
			api.value.exec("redo");
			break;
	}
}

const items = [
	{
		id: "add-before",
		comp: "button",
		icon: "wxi-plus",
		text: "Add: before",
		type: "primary",
		handler: onClick,
	},
	{
		id: "add-after",
		comp: "button",
		icon: "wxi-plus",
		text: "Add: after",
		type: "primary",
		handler: onClick,
	},
	{ comp: "separator" },
	{
		id: "edit",
		comp: "icon",
		icon: "wxi-edit",
		handler: onClick,
	},
	{
		id: "delete",
		comp: "icon",
		icon: "wxi-delete",
		handler: onClick,
	},
	{ comp: "spacer" },
	{
		id: "undo",
		comp: "icon",
		icon: "wxi-undo",
		handler: onClick,
	},
	{
		id: "redo",
		comp: "button",
		icon: "wxi-redo",
		handler: onClick,
	},
];

const normalizedItems = computed(() => {
	if (api.value) {
		return items.map(item => {
			switch (item.id) {
				case "edit":
				case "delete": {
					return {
						...item,
						disabled: !selectedRowsState.value?.length,
					};
				}
				case "undo": {
					return {
						...item,
						disabled: !historyState.value?.undo,
					};
				}
				case "redo": {
					return {
						...item,
						disabled: !historyState.value?.redo,
					};
				}
				default: {
					return item;
				}
			}
		});
	}
	return items;
});
</script>

<template>
	<div style="padding: 20px;">
		<Toolbar :items="normalizedItems" />
		<Grid :data="data" :columns="columns" :init="init" undo />
	</div>
	<Editor
		v-if="dataToEdit"
		:values="dataToEdit"
		:items="getEditorConfig(columns)"
		placement="sidebar"
		:onsave="({ values }) => {
			api.exec('update-row', {
				id: dataToEdit.id,
				row: values,
			});
		}"
		:onaction="() => (dataToEdit = null)"
	/>
</template>
