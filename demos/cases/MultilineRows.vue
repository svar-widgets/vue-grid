<script setup>
import { ref } from "vue";
import { Button } from "@svar-ui/vue-core";
import { repeatColumns, repeatData } from "../data";
import { Grid } from "../../src/";

const api = ref(null);

function addRow() {
	api.value.exec("add-row", { row: {} });
}
function deleteRow() {
	const id = api.value.getState().selectedRows[0];
	if (id) {
		api.value.exec("delete-row", { id });
	}
}
</script>

<template>
	<div class="bar">
		<Button :onclick="addRow" type="primary">Add row</Button>
		<Button :onclick="deleteRow">Delete Row</Button>
	</div>
	<div class="demo">
		<Grid
			ref="api"
			:auto-row-height="true"
			:data="repeatData(60)"
			:columns="
				repeatColumns(15).map(c => ({
					...c,
					resize: true,
					editor: 'text',
				}))
			"
			:footer="true"
			:split="{ left: 2 }"
		/>
	</div>
</template>

<style scoped>
.bar {
	height: 50px;
	padding: 12px;
}
.demo {
	padding: 20px;
	height: calc(100% - 50px);
}
</style>
