<script setup>
defineOptions({ name: "CustomOverlay" });
import { Button } from "@svar-ui/vue-core";

const props = defineProps({
	onaction: { type: Function },
});

function showData() {
	props.onaction?.({
		action: "overlay-button-click",
		data: {
			show: true,
		},
	});
}
</script>

<template>
	<div>Here is a component example</div>
	<div>Click the button to see the data</div>
	<Button type="primary" :onclick="showData">Show data</Button>
</template>
