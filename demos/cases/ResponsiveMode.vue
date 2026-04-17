<script setup>
import { ref, computed } from "vue";
import { getData } from "../data";
import { Button } from "@svar-ui/vue-core";
import { Grid, HeaderMenu } from "../../src/";

const { data } = getData();

const columns = [
	{ id: "id", footer: { text: "All users", colspan: 6 } },
	{ id: "firstName", header: "First Name", flexgrow: 1 },
	{ id: "lastName", header: "Last Name" },
	{ id: "city", header: "City" },

	{ id: "user", header: "User ID" },
	{ id: "email", header: "Email" },
	{
		id: "date",
		header: "Date",
		footer: { text: data.length, css: "right" },
	},
];

const responsive = {
	"1000": {
		columns: [
			{
				id: "id",
				footer: { text: "All users", colspan: 6 },
				flexgrow: 1,
			},
			{ id: "firstName", header: "First Name", flexgrow: 1 },
			{ id: "lastName", header: "Last Name", flexgrow: 1 },
			{ id: "city", header: "City", hidden: true, flexgrow: 1 },
			{ id: "user", header: "User ID", flexgrow: 1 },
			{ id: "email", header: "Email", hidden: true, flexgrow: 1 },
			{
				id: "date",
				header: "Date",
				footer: { text: data.length, css: "right" },
				flexgrow: 1,
			},
		],
		sizes: {
			rowHeight: 40,
			columnWidth: 160,
			headerHeight: 40,
			footerHeight: 40,
		},
	},
	"600": {
		columns: [
			{
				id: "id",
				width: 50,
				footer: { text: "All users", colspan: 4 },
			},
			{
				id: "firstName",
				header: "First Name",
				width: 100,
				flexgrow: 1,
			},
			{
				id: "lastName",
				header: "Last Name",
				width: 100,
				flexgrow: 1,
			},
			{
				id: "city",
				header: "City",
				width: 100,
				flexgrow: 1,
				hidden: true,
			},
			{ id: "user", header: "User ID", width: 100, hidden: true },
			{ id: "email", header: "Email", width: 100, hidden: true },
			{
				id: "date",
				header: "Date",
				width: 100,
				footer: { text: data.length, css: "right" },
				hidden: true,
			},
		],
		sizes: {
			rowHeight: 50,
			columnWidth: 200,
			headerHeight: 50,
			footerHeight: 50,
		},
	},
};

const api = ref(null);

const widths = ["100%", "1000px", "600px"];

const index = ref(0);

const next = computed(() => {
	let i = index.value + 1;
	if (i == widths.length) i = 0;
	return i;
});
</script>

<template>
	<div class="demo">
		<h4>
			DataGrid can have different settings for different container width
		</h4>
		<Button
			type="primary"
			class="btn-change-width"
			:onclick="() => (index = next)"
		>
			Change width to {{ widths[next] }}
		</Button>

		<HeaderMenu :api="api">
			<div :style="`width: ${widths[index]}; margin-top:10px;`">
				<Grid
					ref="api"
					:data="data"
					:columns="columns"
					:responsive="responsive"
					:footer="true"
				/>
			</div>
		</HeaderMenu>
	</div>
</template>

<style scoped>
.demo {
	padding: 20px;
}

.demo :deep(.wx-grid.wx-responsive-1000) {
	font-size: 15px;
}

.demo :deep(.wx-grid.wx-responsive-600) {
	font-size: 16px;

	:deep(.wx-cell) {
		padding-top: 13.4px;
		padding-bottom: 13.4px;
	}
}
</style>
