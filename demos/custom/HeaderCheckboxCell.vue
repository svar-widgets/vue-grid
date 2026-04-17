<script setup>
import { ref } from "vue";
import { Checkbox } from "@svar-ui/vue-core";

const props = defineProps({
	api: {},
	onaction: { type: Function },
});

const value = ref(false);

props.api.getReactiveState().data.subscribe(data => onCellCheck(data));

function onCellCheck(data) {
	if (!data) ({ data } = props.api.getState());
	const checked = data.every(d => d.checked === true);

	if (value.value !== checked) {
		props.onaction?.({
			action: "custom-header-check",
			data: { value: checked },
		});

		value.value = checked;
	}
}

function onChange(ev) {
	const { value } = ev;
	props.onaction?.({
		action: "custom-header-check",
		data: { value, eventSource: "click" },
	});
}
</script>

<template>
	<Checkbox v-model:value="value" :onchange="onChange" />
</template>
