<script setup>
import { Button } from "@svar-ui/vue-core";

const props = defineProps({
	onaction: { type: Function },
});

function onClick() {
	props.onaction?.({
		action: "add-row",
		data: {
			row: {
				firstName: "John",
				lastName: "Smith",
				email: "realemail@gmail.com",
				city: "New York",
			},
		},
	});
}
</script>

<template>
	<Button type="secondary" icon="wxi-plus" :onclick="onClick">
Add row
</Button>
</template>
