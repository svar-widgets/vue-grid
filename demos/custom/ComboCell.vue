<script setup>
import { computed } from "vue";
import { Combo } from "@svar-ui/vue-core";

const props = defineProps({
	row: {},
	column: {},
	onaction: { type: Function },
});

const options = [
	{ id: 1, label: "New Amieshire" },
	{ id: 2, label: "New Gust" },
	{ id: 3, label: "Lefflerstad" },
	{ id: 4, label: "East Catalina" },
	{ id: 5, label: "Ritchieborough" },
];

const id = computed(() => {
	const option = options.find(i => i.label === props.row[props.column.id]);
	return option && option.id ? option.id : 1;
});

function onChange(ev) {
	const { value } = ev;
	props.onaction?.({
		action: "custom-combo",
		data: {
			value: options.find(i => i.id === value).label,
			column: props.column.id,
			row: props.row.id,
		},
	});
}
</script>

<template>
	<Combo :options="options" :value="id" :onchange="onChange">
		<template #default="{ option }">
			{{ option.label }}
		</template>
	</Combo>
</template>
