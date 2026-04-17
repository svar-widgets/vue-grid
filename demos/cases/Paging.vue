<script setup>
defineOptions({ name: "DemoPaging" });
import { ref } from "vue";
import { Pager } from "@svar-ui/vue-core";
import { Grid } from "../../src";

import { getData } from "../data";
const { allData, columns } = getData();

const data = ref([]);
function setPage(ev) {
	const { from, to } = ev;
	data.value = allData.slice(from, to);
}
setPage({ from: 0, to: 8 });
</script>

<template>
	<div style="padding: 20px">
		<Pager :total="allData.length" :page-size="8" :onchange="setPage" />
		<div>
			<Grid :data="data" :columns="columns" />
		</div>
	</div>
</template>
