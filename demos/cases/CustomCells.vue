<script setup>
import { inject } from "vue";
import { Grid } from "../../src";
import { getData } from "../data";

import CheckboxCell from "../custom/CheckboxCell.vue";
import UserCell from "../custom/UserCell.vue";
import HeaderTextCell from "../custom/HeaderTextCell.vue";
import FooterTextCell from "../custom/FooterTextCell.vue";

const helpers = inject("wx-helpers");
const { data } = getData();

const columns = [
	{
		id: "id",
		width: 50,
		header: [{ cell: HeaderTextCell, colspan: 3 }],
		footer: [
			{
				cell: FooterTextCell,
				colspan: 3,
				text: "Custom footer content",
			},
		],
	},
	{
		id: "checked",
		cell: CheckboxCell,
		width: 36,
	},
	{ id: "avatar", cell: UserCell, width: 350 },
];

function action(action, ev) {
	const { value, row, column } = ev;
	const event = `event: ${action}\n`;
	const val = `value: ${value}\n`;
	const r = `row ID: ${row}\n`;
	const c = `col ID: ${column}\n`;

	helpers.showNotice({
		text: event + val + r + c,
	});
}
</script>

<template>
	<div class="demo" style="padding: 20px">
		<h4>Table with custom cells and templates</h4>
		<div style="height: 320px; max-width: 800px">
			<Grid
				:sizes="{ rowHeight: 70 }"
				:data="data"
				:columns="columns"
				:footer="true"
				:cell-style="
					(row, col) => {
						let css = '';
						if (col.id == 'id') css = 'vcenter';
						else if (col.id == 'checked') css = 'vcentercontrol';
						return css;
					}
				"
				@custom-check="ev => action('checkbox', ev)"
			/>
		</div>
	</div>
</template>

<style scoped>
.demo :deep(.vcenter) {
	line-height: 50px;
}

.demo :deep(.vcentercontrol) {
	padding-top: 25px !important;
}
</style>
