<script setup>
defineOptions({ name: "GridInlineEditorsMultiSelect" });

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
});

const config = props.editor?.config;
const options = computed(() => props.editor?.options ?? []);
const value = computed(() => props.editor?.value || []);
const renderedValue = computed(() => props.editor?.renderedValue);
const index = computed(() => {
	const firstSelected = options.value.find(opt =>
		value.value.includes(opt.id)
	);
	return firstSelected ? options.value.indexOf(firstSelected) : -1;
});

const dropdownOptions = computed(() => {
	const dropdown = config?.dropdown || {};
	return { trackScroll: true, ...dropdown };
});

function updateValue({ id }) {
    props.onapply(id);
    node.value.focus();
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
		@click="() => props.onsave()"
		@keydown.prevent="ev => keydown(ev, index)"
		v-click-outside="() => onsave(true)"
	>
		<template v-if="config?.template">
			{{ config.template(value?.map(id => options.find(opt => opt.id === id))) }}
		</template>
		<component
			v-else-if="config?.cell"
			:is="config.cell"
			:data="value.map(id => options.find(opt => opt.id === id))"
		/>
		<span v-else class="wx-text">{{ renderedValue }}</span>
	</div>

	<SuggestDropdown
		:items="options"
		:onready="ready"
		:onselect="updateValue"
		:checkboxes="true"
		:multiselect="true"
		v-bind="dropdownOptions"
		:oncancel="() => props.onsave()"
		:value="value"
	>
		<template #default="{ option }">
			<div class="wx-option">
				<template v-if="config?.template">
					{{ config.template(option) }}
				</template>
				<component
					v-else-if="config?.cell"
					:is="config.cell"
					:data="option"
					:onaction="onaction"
				/>
				<template v-else>{{ option.label }}</template>
			</div>
		</template>
	</SuggestDropdown>
</template>

<style scoped>
.wx-option {
	display: flex;
	direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 8px;
}
.wx-text {
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.wx-value {
	width: 100%;
	height: 100%;
	padding: 8px;
	overflow: hidden;
	outline: none;
	border: 1px solid var(--wx-color-primary);
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
