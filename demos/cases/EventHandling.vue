<script setup>
import { ref, inject } from "vue";
import { Field, Switch, Button } from "@svar-ui/vue-core";
import { EventResolver } from "@svar-ui/lib-state";
import { RestDataProvider } from "@svar-ui/grid-data-provider";

import { getBackend } from "../data";
import { Grid } from "../../src";

const { columns } = getBackend();
const helpers = inject("wx-helpers");
const blockSelect = ref(false);
let kapi;

const data = ref([]);
const provider = new RestDataProvider(
	"https://grid-backend.svar.dev/films",
	o => o
);
provider.getData().then(v => (data.value = v));

async function addRow() {
	const ev = await kapi.exec("add-row", {
		row: {},
		done: ev => {
			helpers.showNotice({ text: "row added, id:" + ev.row.id });
		},
	});
	helpers.showNotice({ text: "[add] finish, server:" + ev.response.id });
}

async function deleteRow() {
	await kapi.exec("delete-row", {
		id: kapi.getState().selectedRows[0],
		done: () => {
			helpers.showNotice({ text: "[delete] store" });
		},
	});
	helpers.showNotice({ text: "[delete] finish" });
}

function init(api) {
	// add a catch for the event fulfillment
	api.setNext(new EventResolver("done")).setNext(provider);

	//selection handlers
	api.on("select-row", log("[select] on"));
	api.intercept("select-row", () => {
		if (blockSelect.value) return false;
		else log("[select] intercept")();
	});

	api.on("add-row", log("[add] on"));
	api.intercept("add-row", log("[add] intercept"));

	api.on("delete-row", log("[delete] on"));
	api.intercept("delete-row", log("[delete] intercept"));

	kapi = api;
}

function log(text) {
	return () => helpers.showNotice({ text });
}
</script>

<template>
	<div style="padding: 20px;">
		<div>
			<Field label="Prevent selection after adding">
				<Switch v-model:value="blockSelect" />
			</Field>
			<Button :onclick="addRow" type="primary">Add row</Button>
			<Button :onclick="deleteRow">Delete row</Button>
			<hr />

			<Grid
				:init="init"
				:data="data"
				:columns="columns"
				@select-row="log('[select] handler')"
				@add-row="log('[add] handler')"
				@delete-row="log('[delete] handler')"
			/>
		</div>
	</div>
</template>
