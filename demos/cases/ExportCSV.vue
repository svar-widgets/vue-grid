<script setup>
import { ref } from "vue";
import { Grid } from "../../src";
import { Button } from "@svar-ui/vue-core";

import { getData } from "../data";
const { clientData, clientColumns, treeData, treeFixedColumns } = getData();

const api1 = ref(null);
const api2 = ref(null);

function exportCsv(api) {
	api.exec("export-data", {
		format: "csv",
		fileName: "clients",
		csv: {
			cols: ";",
		},
	});
}
</script>

<template>
	<div style="padding: 20px;">
		<p>
			<Button type="primary" :onclick="() => exportCsv(api1)">
				Export to CSV
			</Button>
		</p>
		<div style="max-width: 800px;">
			<Grid
				:footer="true"
				:data="clientData"
				:columns="clientColumns"
				ref="api1"
			/>
		</div>
	</div>

	<div style="padding: 20px;">
		<p>
			<Button type="primary" :onclick="() => exportCsv(api2)">
Export to CSV
</Button>
		</p>
		<div style="max-width: 800px;">
			<Grid
				ref="api2"
				:tree="true"
				:data="treeData"
				:columns="treeFixedColumns"
				:footer="true"
			/>
		</div>
	</div>
</template>
