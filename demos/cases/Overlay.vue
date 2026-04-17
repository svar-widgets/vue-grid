<script setup>
defineOptions({ name: "DemoOverlay" });
import { ref } from "vue";
import { Grid } from "../../src";
import Overlay from "../custom/Overlay.vue";
import { getData } from "../data";

const { columns, data } = getData();

const showOverlay = ref(true);

function showData({ show }) {
	if (show) showOverlay.value = false;
}
</script>

<template>
	<div style="padding: 20px">
		<h4>Overlay as a text</h4>
		<div>
			<Grid
				:data="data.slice(0, 5)"
				:columns="columns"
				overlay="Loading..."
				:footer="true"
			/>
		</div>
		<h4>Overlay as a component</h4>
		<div>
			<Grid
				:data="data"
				:columns="columns"
				:overlay="showOverlay ? Overlay : null"
				:footer="true"
				@overlay-button-click="showData"
			/>
		</div>
	</div>
</template>
