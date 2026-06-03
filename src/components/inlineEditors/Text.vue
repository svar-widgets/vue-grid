<script setup>
defineOptions({ name: "GridInlineEditorsText" });

import { ref, computed, onMounted } from "vue";
import { clickOutside } from "@svar-ui/lib-dom";
import { asDirective } from "@svar-ui/lib-vue";

const vClickOutside = asDirective(clickOutside);

const props = defineProps({
	editor: {},
	onsave: { type: Function },
	onapply: { type: Function },
});

const value = ref(props.editor.value || "");
const type = computed(() => props.editor?.config?.type ?? "text");
const node = ref(null);

onMounted(() => node.value.focus());

function updateValue() {
	value.value = node.value.value;
	props.onapply(node.value.value);
}

function closeAndSave({ key }) {
	if (key === "Enter") props.onsave();
}
</script>

<template>
	<input
		v-click-outside="() => props.onsave(true)"
		class="wx-text"
		@input="updateValue"
		@keydown="closeAndSave"
		ref="node"
		:type="type"
		:value="value"
	/>
</template>

<style scoped>
.wx-text {
	width: 100%;
	height: 100%;
	border: none;
	outline: none;
	padding-left: 8px;
	font: inherit;
	background: var(--wx-background);
	color: var(--wx-color-font);
	border: 1px solid var(--wx-color-primary);
}
</style>
