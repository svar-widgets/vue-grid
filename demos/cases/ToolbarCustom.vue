<script setup>
import { ref, inject } from "vue";
import { getData } from "../data";
import {
	Grid,
	Toolbar,
	defaultToolbarButtons,
	getEditorConfig,
} from "../../src";
import { Editor, registerEditorItem } from "@svar-ui/vue-editor";
import { RichSelect, DatePicker } from "@svar-ui/vue-core";

const helpers = inject("wx-helpers");
const { data, countries } = getData();
let api = ref(null);
const dataToEdit = ref(null);

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

// filter default buttons
const outButtons = ["copy-row", "cut-row", "paste-row"];
const items = defaultToolbarButtons.filter(b => {
	return !outButtons.includes(b.id);
});

items.splice(1, 0, {
	id: "my-action",
	comp: "icon",
	icon: "wxi-cat",
});

function handleClick(ev) {
	if (ev.item.id === "my-action") {
		helpers.showNotice({ text: "'My action' clicked" });
	}
}

function init(obj) {
	api.value = obj;

	api.value.intercept("open-editor", () => {
		const id = api.value.getState().selectedRows[0];
		if (id) dataToEdit.value = api.value.getRow(id);
		return false;
	});
}
</script>

<template>
	<div style="padding: 20px;">
		<Toolbar :api="api" :items="items" :onclick="handleClick" />
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
