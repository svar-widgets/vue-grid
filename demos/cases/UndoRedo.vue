<script setup>
import { ref, computed } from "vue";
import { subscribeLater } from "@svar-ui/lib-vue";
import { Button } from "@svar-ui/vue-core";
import { getData } from "../data";
import { Grid, HeaderMenu, ContextMenu } from "../../src";

const { data } = getData();

const api = ref(null);
const historyState = subscribeLater(() => api.value?.getReactiveState().history);
const hasUndo = computed(() => historyState().value?.undo);
const hasRedo = computed(() => historyState().value?.redo);


function init(obj) {
	api.value = obj;
}

const columns = [
	{ id: "id", width: 50 },
	{
		id: "firstName",
		header: "First Name",
		footer: "First Name",
		editor: "text",
		width: 150,
	},
	{
		id: "lastName",
		header: "Last Name",
		footer: "Last Name",
		editor: "text",
		width: 150,
	},
	{
		id: "email",
		header: { text: "Email", collapsible: true },
		footer: "Email",
	},
	{
		id: "companyName",
		header: { text: "Company", collapsible: true },
		footer: "Company",
	},
	{ id: "city", header: "City" },
	{ id: "stars", header: "Stars" },
];

columns.forEach(c => (c.resize = true));

function handleUndo() {
	api.value.exec("undo");
}
function handleRedo() {
	api.value.exec("redo");
}
</script>

<template>
	<div style="padding: 20px;">
		<div class="buttons" style="margin: 20px 0;">
			<Button
				type="primary"
				:onclick="handleUndo"
				:disabled="!hasUndo"
				>
Undo
</Button>
			<Button
				type="primary"
				:onclick="handleRedo"
				:disabled="!hasRedo"
				>
Redo
</Button>
		</div>
		<div>
			<ContextMenu :api="api">
				<HeaderMenu :api="api">
					<Grid :data="data" :columns="columns" :init="init" undo reorder />
				</HeaderMenu>
			</ContextMenu>
		</div>
	</div>
</template>

<style scoped>
.buttons {
	display: flex;
	gap: 10px;
}
</style>
