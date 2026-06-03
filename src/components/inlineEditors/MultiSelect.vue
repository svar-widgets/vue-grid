<script setup>
defineOptions({ name: "GridInlineEditorsMultiSelect" });

import { computed } from "vue";
import { clickOutside } from "@svar-ui/lib-dom";
import { asDirective } from "@svar-ui/lib-vue";
import MultiSelect from "../MultiSelect.vue";

const vClickOutside = asDirective(clickOutside);

const props = defineProps({
	editor: {},
	onaction: { type: Function },
	onsave: { type: Function },
	onapply: { type: Function },
});

const config = props.editor?.config || {};
const options = computed(() => props.editor?.options ?? []);
const value = computed(() => props.editor?.value || []);
const text = computed(() => props.editor?.renderedValue);

const dropdownOptions = computed(() => ({
	trackScroll: true,
	...(config.dropdown || {}),
}));

function updateValue({ value }) {
	props.onapply(value);
}
</script>

<template>
	<div
		class="wx-value"
		@click="onsave(true)"
		v-click-outside="() => onsave(true)"
	>
		<MultiSelect
			:value="value"
			:options="options"
			:text="text"
			:template="config.template"
			:cell="config.cell"
			:clear="config.clear"
			:dropdown="dropdownOptions"
			auto-open
			:onchange="updateValue"
			:onaction="onaction"
		/>
	</div>
</template>

<style scoped>
.wx-value {
	width: 100%;
	height: 100%;
	background: var(--wx-background);
}
.wx-value :deep(.wx-multiselect) {
	width: 100%;
	height: 100%;
	border: 1px solid var(--wx-color-primary);
	border-radius: 0;
	background: var(--wx-background);
}
.wx-value :deep(.wx-multiselect:focus) {
	border: 1px solid var(--wx-color-primary);
}
</style>
