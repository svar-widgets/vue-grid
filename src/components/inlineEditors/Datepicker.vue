<script setup>
defineOptions({ name: "GridInlineEditorsDatepicker" });

import { ref, shallowRef, computed, onMounted } from "vue";
import { clickOutside } from "@svar-ui/lib-dom";
import { asDirective } from "@svar-ui/lib-vue";
import { Calendar, Dropdown } from "@svar-ui/vue-core";

const vClickOutside = asDirective(clickOutside);

const props = defineProps({
	editor: {},
	onaction: { type: Function },
	onsave: { type: Function },
	onapply: { type: Function },
	oncancel: { type: Function },
});

const value = ref(props.editor.value || new Date());
const { template, cell, dropdown = {} } = props.editor?.config || {};
const templateRef = shallowRef(template);
const cellRef = shallowRef(cell);
const dropdownRef = ref(dropdown);
const dropdownOptions = computed(() => ({
	trackScroll: true,
	width: "auto",
	...dropdownRef.value,
}));

function updateValue({ value }) {
	props.onapply(value);
	props.onsave();
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
		class="wx-value"
		ref="node"
		tabindex="0"
		@click="oncancel"
		@keydown.prevent
	>
		<template v-if="templateRef">
			{{ templateRef(value) }}
		</template>
		<template v-else-if="cellRef">
			<component :is="cellRef" :data="editor.value" :onaction="onaction" />
		</template>
		<span v-else class="wx-text">{{ editor.renderedValue }}</span>
	</div>
	<Dropdown v-bind="dropdownOptions" :oncancel="props.oncancel">
		<div v-click-outside="() => props.onsave(true)">
			<Calendar
				:value="value"
				:onchange="updateValue"
				:buttons="editor.config?.buttons"
			/>
		</div>
	</Dropdown>
</template>

<style scoped>
.wx-value {
	width: 100%;
	height: 100%;
	padding: 8px;
	overflow: hidden;
	outline: none;
	border: 1px solid var(--wx-color-primary);
}
.wx-text {
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
}
</style>
