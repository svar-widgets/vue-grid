<script setup>
import { Grid, registerInlineEditor } from "../../src";
import { getData } from "../data";
import SelectEditorCell from "../custom/SelectEditorCell.vue";
import EditorDateCell from "../custom/EditorDateCell.vue";
import EditorSelectCell from "../custom/EditorSelectCell.vue";
import EditorDestinationsCell from "../custom/EditorDestinationsCell.vue";
import DestinationCell from "../custom/DestinationCell.vue";
import ColorEditor from "../custom/ColorEditor.vue";
import ColorCell from "../custom/ColorCell.vue";

const { allData: data, countries, users } = getData();

registerInlineEditor("color", ColorEditor);

const columns = [
	{ id: "id", width: 50 },
	{
		id: "country",
		header: 'Country - "combo"',
		editor: {
			type: "combo",
			config: {
				cell: EditorSelectCell,
			},
		},
		options: countries,
		cell: SelectEditorCell,
		width: 180,
	},
	{
		id: "date",
		header: 'Date - "datepicker"',
		width: 180,
		editor: {
			type: "datepicker",
			config: {
				cell: EditorDateCell,
			},
		},
		template: v => (v ? v.toLocaleDateString() : ""),
	},
	{
		id: "user",
		header: 'User - "richselect"',
		width: 180,
		editor: {
			type: "richselect",
			config: {
				cell: EditorSelectCell,
			},
		},
		options: users,
		cell: SelectEditorCell,
	},
	{
		id: "destinations",
		header: 'Destinations - "multiselect"',
		editor: {
			type: "multiselect",
			config: {
				cell: EditorDestinationsCell,
				dropdown: { width: "auto" },
			},
		},
		options: countries,
		width: 230,
		cell: DestinationCell,
	},
	{
		id: "color",
		header: 'Color - custom "color"',
		editor: "color",
		width: 180,
		cell: ColorCell,
	},
];
</script>

<template>
	<div style="padding: 20px">
		<h4>Editable cells: inline editors with custom cells</h4>
		<div style="height: 500px;">
			<Grid :data="data" :columns="columns" />
		</div>
	</div>
</template>
