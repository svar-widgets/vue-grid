<script setup>
defineOptions({ name: "GridInlineEditorsCombo" });

import { ref, computed, onMounted } from "vue";
import { SuggestDropdown } from "@svar-ui/vue-core";
import { clickOutside } from "@svar-ui/lib-dom";
import { asDirective } from "@svar-ui/lib-vue";

const vClickOutside = asDirective(clickOutside);

const props = defineProps({
	editor: {},
	onaction: { type: Function },
	onsave: { type: Function },
	onapply: { type: Function },
	oncancel: { type: Function },
});

const text = ref(props.editor.renderedValue);
const filterOptions = ref(props.editor.options);
const template = props.editor?.config?.template;
const cell = props.editor?.config?.cell;
const dropdown = props.editor?.config?.dropdown ?? {};
const value = props.editor.value;

const dropdownOptions = computed(() => ({ trackScroll: true, ...dropdown }));

const index = computed(() =>
	filterOptions.value.findIndex(a => a.id === value)
);

function updateValue({ id }) {
	props.onapply(id);
	props.onsave();
}

let navigate;
const keydown = ref(null);

function ready(ev) {
	navigate = ev.navigate;
	keydown.value = ev.keydown;
	navigate(index.value);
}

function input() {
	filterOptions.value = text.value
		? props.editor.options.filter(i =>
				i.label.toLowerCase().includes(text.value.toLowerCase())
			)
		: props.editor.options;

	if (filterOptions.value.length) navigate(-Infinity);
	else navigate(null);
}

const node = ref(null);
onMounted(() => {
	node.value.focus();
});
</script>

<template>
	<input
		class="wx-input"
		ref="node"
		v-model="text"
		@input="input"
		@keydown="e => keydown(e, index)"
		v-click-outside="() => onsave(true)"
	/>
	<SuggestDropdown
		:items="filterOptions"
		:onready="ready"
		:onselect="updateValue"
		v-bind="dropdownOptions"
		:oncancel="props.oncancel"
	>
		<template #default="{ option }">
			<template v-if="template">{{ template(option) }}</template>
			<component
				v-else-if="cell"
				:is="cell"
				:data="option"
				:onaction="onaction"
			/>
			<template v-else>{{ option.label }}</template>
		</template>
	</SuggestDropdown>
</template>

<style scoped>
.wx-input {
	height: 100%;
	width: 100%;
	border: none;
	outline: none;
	padding-left: 8px;
	font: inherit;
	background: var(--wx-background);
	color: var(--wx-color-font);
	border: 1px solid var(--wx-color-primary);
}
</style>
