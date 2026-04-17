<script setup>
import { getData } from "../data";
import { Grid } from "../../src/";

const { data, columns } = getData();
</script>

<template>
	<div style="padding: 20px;">
		<div>
			<Grid :data="data" :columns="columns" />
		</div>
	</div>
</template>
