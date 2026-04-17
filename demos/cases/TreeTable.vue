<script setup>
import { ref } from "vue";
import { Button } from "@svar-ui/vue-core";
import { getData } from "../data";
import { Grid } from "../../src/";

const { treeData, treeColumns } = getData();

const api = ref();

function openAll() {
	api.value.exec("open-row", { id: 0, nested: true });
}

function closeAll() {
	api.value.exec("close-row", { id: 0, nested: true });
}
</script>

<template>
	<div style="padding: 20px;">
		<div class="toolbar">
			<Button type="primary" :onclick="() => openAll()">Open all</Button>
			<Button type="primary" :onclick="() => closeAll()">Close all</Button>
		</div>
		<div>
			<Grid
				ref="api"
				:tree="true"
				:data="treeData"
				:columns="treeColumns"
				:footer="true"
			/>
		</div>
	</div>
</template>

<style scoped>
.toolbar {
	margin-bottom: 10px;
}
</style>
