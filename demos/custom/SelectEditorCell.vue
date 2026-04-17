<script setup>
import { computed } from "vue";
import EditorSelectCell from "./EditorSelectCell.vue";

const props = defineProps({
	row: {},
	column: {},
});

const data = computed(() => {
	const options = props.column.options;
	return options?.find(o => o.id == props.row[props.column.id]);
});
</script>

<template>
	<EditorSelectCell :data="data" />
</template>
