<script setup>
defineOptions({ name: "GridMultiSelect" });

import { ref, computed, onMounted } from "vue";
import { SuggestDropdown } from "@svar-ui/vue-core";

const props = defineProps({
	options: { default: () => [] },
	placeholder: { default: "" },
	clear: { type: Boolean, default: false },
	text: { default: null },
	template: { default: null },
	cell: { default: null },
	dropdown: { default: () => ({}) },
	autoOpen: { type: Boolean, default: false },
	onchange: { type: Function },
	onaction: { type: Function },
});

const value = defineModel("value", { default: () => [] });

const selected = computed(() =>
	(value.value || [])
		.map(id => props.options.find(o => o.id === id))
		.filter(Boolean)
);

const node = ref(null);
let navigate;
const keydown = ref(null);

function ready(ev) {
	navigate = ev.navigate;
	keydown.value = ev.keydown;
	if (props.autoOpen) navigate(index());
}

onMounted(() => {
	if (props.autoOpen) {
		node.value?.focus();
		if (window?.getSelection) window.getSelection().removeAllRanges();
	}
});

const index = () => {
	const v = value.value || [];
	if (!v.length) return 0;
	const firstSelected = props.options.find(o => v.includes(o.id));
	return firstSelected ? props.options.indexOf(firstSelected) : 0;
};

function select({ id }) {
	value.value = id;
	props.onchange && props.onchange({ value: value.value });
}

function unselect(ev) {
	ev.stopPropagation();
	value.value = [];
	props.onchange && props.onchange({ value: value.value });
}

function onclick() {
	navigate?.(index());
}

function oncancel() {
	navigate?.(null);
}
</script>

<template>
	<div
		ref="node"
		class="wx-multiselect"
		tabindex="0"
		@click="onclick"
		@keydown="ev => keydown?.(ev, index())"
	>
		<div class="wx-label">
			<template v-if="template">
				{{ template(selected) }}
			</template>
			<component
				v-else-if="cell"
				:is="cell"
				:data="selected"
				:onaction="onaction"
			/>
			<span v-else-if="text" class="wx-text">{{ text }}</span>
			<span v-else-if="selected.length" class="wx-text">{{
				selected.map(s => s.label).join(", ")
			}}</span>
			<span v-else-if="placeholder" class="wx-placeholder">{{
				placeholder
			}}</span>
			<template v-else>&nbsp;</template>
		</div>

		<i
			v-if="clear && value?.length"
			class="wx-icon wxi-close"
			@click="unselect"
		></i>
		<i v-else class="wx-icon wxi-angle-down"></i>

		<SuggestDropdown
			:items="options"
			:onready="ready"
			:onselect="select"
			:multiselect="true"
			:checkboxes="true"
			:value="value || []"
			:oncancel="oncancel"
			v-bind="dropdown"
		>
			<template #default="{ option }">
				<div class="wx-option">
					<template v-if="template">
						{{ template(option) }}
					</template>
					<component
						v-else-if="cell"
						:is="cell"
						:data="option"
						:onaction="onaction"
					/>
					<template v-else>{{ option.label }}</template>
				</div>
			</template>
		</SuggestDropdown>
	</div>
</template>

<style scoped>
.wx-multiselect {
	position: relative;
	outline: none;
	width: var(--wx-input-width);
	min-height: var(--wx-input-height);
	border: var(--wx-input-border);
	border-radius: var(--wx-input-border-radius);
	background: var(--wx-input-background);
	cursor: pointer;
}
.wx-multiselect:focus {
	border: var(--wx-input-border-focus);
}

.wx-label {
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	display: block;
	width: 100%;
	font-family: var(--wx-input-font-family);
	font-size: var(--wx-input-font-size);
	line-height: var(--wx-input-line-height);
	font-weight: var(--wx-input-font-weight);
	text-align: var(--wx-input-text-align);
	color: var(--wx-input-font-color);
	padding: var(--wx-input-padding);
	padding-right: calc(
		var(--wx-input-icon-size) + var(--wx-input-icon-indent) * 2
	);
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.wx-text {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
}

.wx-placeholder {
	color: var(--wx-input-placeholder-color);
}

.wx-icon {
	position: absolute;
	right: var(--wx-input-icon-indent);
	top: 50%;
	transform: translateY(-50%);
	font-size: var(--wx-input-icon-size);
	line-height: 1;
	width: var(--wx-input-icon-size);
	height: var(--wx-input-icon-size);
	display: flex;
	justify-content: center;
	align-items: center;
	pointer-events: none;
	user-select: none;
	color: var(--wx-input-icon-color);
}
.wx-icon:before {
	display: block;
}
.wx-icon.wxi-close {
	pointer-events: all;
}
.wx-icon.wxi-close:hover {
	background: var(--wx-background-hover);
	border-radius: var(--wx-icon-border-radius);
}

.wx-option {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 8px;
}
</style>
