<script setup>
import { ref } from "vue";
import { getData } from "../data";
import { Grid, HeaderMenu } from "../../src/";

const { data, columnsSpans } = getData();

const api = ref(null);
</script>

<template>
	<div class="demo" style="padding: 20px">
		<div>
			<HeaderMenu :api="api">
				<Grid
					ref="api"
					:data="data"
					:columns="columnsSpans"
					:footer="true"
				/>
			</HeaderMenu>
		</div>
	</div>
</template>

<style scoped>
.demo :deep(.center) {
	justify-content: center;
}

.demo :deep(.right) {
	justify-content: right;
}
</style>
