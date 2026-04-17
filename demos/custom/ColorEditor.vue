<script setup>
defineOptions({ name: "CustomColorEditor" });

import { ref, onMounted } from "vue";
import { ColorBoard, Dropdown } from "@svar-ui/vue-core";
import { clickOutside } from "@svar-ui/lib-dom";
import { asDirective } from "@svar-ui/lib-vue";

const vClickOutside = asDirective(clickOutside);

const props = defineProps({
	editor: {},
	onsave: { type: Function },
	onapply: { type: Function },
	onaction: { type: Function },
	oncancel: { type: Function },
});

const value = ref(props.editor.value);

function updateValue({ value, input }) {
	if (input) props.onapply(value);
	else props.onsave();
}

const node = ref(null);
onMounted(() => {
	node.value.focus();
	if (window.getSelection) {
		window.getSelection().removeAllRanges();
	}
});
</script>

<template>
	<div
		class="value"
		ref="node"
		tabindex="0"
		:onclick="oncancel"
	>
		{{ value }}
	</div>
	<Dropdown :width="'auto'" :track-scroll="true" :oncancel="props.oncancel">
		<div v-click-outside="() => onsave(true)">
			<ColorBoard :value="value" :onchange="updateValue" :button="true" />
		</div>
	</Dropdown>
</template>

<style scoped>
.value {
	width: 100%;
	height: 100%;
	padding: 8px;
	outline: none;
	border: 1px solid var(--wx-color-primary);
}
</style>
