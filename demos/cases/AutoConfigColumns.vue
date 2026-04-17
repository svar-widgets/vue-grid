<script setup>
import { getData } from "../data";
import { Grid } from "../../src";

const { allData } = getData();
const config = { editor: "text" };
</script>

<template>
	<div style="padding: 20px;">
		<div style="height: 620px; max-width: 800px;">
			<Grid :data="allData" :auto-config="config" />
		</div>
	</div>
</template>
