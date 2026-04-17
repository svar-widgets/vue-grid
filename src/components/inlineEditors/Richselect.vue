<script setup>
defineOptions({ name: "GridInlineEditorsRichselect" });

import { ref, shallowRef, computed, onMounted } from "vue";
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

const data = ref(
	props.editor.options.find(opt => opt.id === props.editor.value)
);
const value = ref(props.editor.value);
const options = ref(props.editor.options);
const template = shallowRef(props.editor?.config?.template);
const cell = shallowRef(props.editor?.config?.cell);
const dropdown = ref(props.editor?.config?.dropdown || {});
const dropdownOptions = computed(() => ({ trackScroll: true, ...dropdown.value }));

const index = computed(() => options.value.findIndex(a => a.id === value.value));

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

const node = ref(null);
onMounted(() => {
	node.value.focus();
	if (window && window.getSelection) {
		window.getSelection().removeAllRanges();
	}
});
</script>

<template>
	<div
		ref="node"
		class="wx-value"
		tabindex="0"
		@click="oncancel"
		@keydown.prevent="ev => keydown(ev, index)"
		v-click-outside="() => onsave(true)"
	>
		<template v-if="template">
			{{ template(data) }}
		</template>
		<template v-else-if="cell">
			<component :is="cell" :data="data" :onaction="onaction" />
		</template>
		<span v-else class="wx-text">{{ editor.renderedValue }}</span>
	</div>
	<SuggestDropdown
		:items="options"
		:onready="ready"
		:onselect="updateValue"
		v-bind="dropdownOptions"
		:oncancel="props.oncancel"
	>
		<template #default="{ option }">
			<template v-if="template">
				{{ template(option) }}
			</template>
			<template v-else-if="cell">
				<component :is="cell" :data="option" :onaction="onaction" />
			</template>
			<template v-else>{{ option.label }}</template>
		</template>
	</SuggestDropdown>
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
}

.wx-value:focus {
	outline: none;
	display: block;
}
</style>
