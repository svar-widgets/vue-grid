<script setup>
import { getData } from "../data";
import { Grid } from "../../src";

const { data, columnsVertical: columns, columnsSpansVertical: scolumns } = getData();
data.length = 5;
</script>

<template>
	<div class="demo" style="padding: 20px">
		<div>
			<Grid :data="data" :columns="columns" :footer="true" />
		</div>
		<div style="margin-top: 20px">
			<Grid :data="data" :columns="scolumns" :footer="true" />
		</div>
	</div>
</template>

<style scoped>
.demo :deep(.footer) {
	border-bottom: none;
}

.demo :deep(.wx-right) {
	justify-content: right;
}
</style>
