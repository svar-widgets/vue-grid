<script setup>
import { ref } from "vue";
import { Field, Slider } from "@svar-ui/vue-core";
import { Grid } from "../../src";

import { getData } from "../data";
const { data, allColumns } = getData();

const left = ref(2);
</script>

<template>
	<div style="padding: 20px">
		<h4>Drag the slider to fix columns on the left</h4>
		<div class="controls">
			<Field label="Fix columns">
				<Slider :min="0" :max="4" v-model:value="left" />
			</Field>
		</div>

		<div style="max-width: 800px">
			<Grid :data="data" :columns="allColumns" :split="{ left }" />
		</div>
	</div>
</template>

<style scoped>
.controls {
	margin-bottom: 10px;
}
</style>
