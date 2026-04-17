<script setup>
defineOptions({ name: "DemoLocalization" });
import { ref } from "vue";
import { getData } from "../data";
import { Grid, ContextMenu, HeaderMenu } from "../../src";
import { Locale, Segmented } from "@svar-ui/vue-core";
import { en, cn } from "@svar-ui/grid-locales";
import { en as enCore, cn as cnCore } from "@svar-ui/core-locales";

const { allData: data, countries, users } = getData();
const table = ref();

function init(api) {
	table.value = api;
}

const columns = [
	{ id: "id", width: 50 },
	{
		id: "firstName",
		header: "Name",
		editor: "text",
		width: 180,
	},
	{
		id: "country",
		header: "Country",
		editor: {
			type: "combo",
			config: { template: option => `${option.id}. ${option.label}` },
		},
		options: countries,
		width: 180,
	},
	{
		id: "date",
		header: "Date",
		width: 180,
		editor: "datepicker",
		template: v => (v ? v.toLocaleDateString() : ""),
	},
	{
		id: "user",
		header: "User",
		width: 180,
		editor: "richselect",
		options: users,
	},
];

const language = ref("en");
</script>

<template>
	<div class="demo">
		<Segmented
			:options="[
				{ id: 'en', label: 'English' },
				{ id: 'cn', label: 'Chinese' },
			]"
			v-model:value="language"
		/>
		<template v-if="language == 'en'">
			<Locale :words="{ ...en, ...enCore }">
				<ContextMenu :api="table">
					<HeaderMenu :api="table">
						<Grid :data="data" :columns="columns" :init="init" />
					</HeaderMenu>
				</ContextMenu>
			</Locale>
		</template>
		<template v-else-if="language == 'cn'">
			<Locale :words="{ ...cn, ...cnCore }">
				<ContextMenu :api="table">
					<HeaderMenu :api="table">
						<Grid :data="data" :columns="columns" :init="init" />
					</HeaderMenu>
				</ContextMenu>
			</Locale>
		</template>
	</div>
</template>

<style scoped>
.demo {
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>
