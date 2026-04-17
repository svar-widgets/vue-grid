<script setup>
import { ref } from "vue";
import { getData } from "../data";
import { Grid, ContextMenu, HeaderMenu } from "../../src/";

const { data, flexibleColumns: columns } = getData();
const grid = ref(null);
</script>

<template>
	<div style="padding: 20px">
		<h4>Context menu with default actions</h4>
		<ContextMenu :api="grid">
			<HeaderMenu :api="grid">
				<Grid
					:data="data"
					:columns="columns"
					ref="grid"
					:multiselect="true"
					:reorder="true"
				/>
			</HeaderMenu>
		</ContextMenu>
	</div>
</template>
