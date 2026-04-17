<script setup>
defineOptions({ name: "GridTooltip" });

import { ref, watchEffect } from "vue";
import { getRenderValue } from "@svar-ui/grid-store";
import { getID } from "@svar-ui/lib-dom";

const props = defineProps({
	content: { type: Object, default: undefined },
	api: { type: Object, default: undefined },
});

const area = ref(null);
const tooltipNode = ref(null);
const areaCoords = ref(null);
const tooltipData = ref(null);
const pos = ref(null);

function findAttribute(node) {
	while (node) {
		if (node.getAttribute) {
			const id = getID(node, "data-row-id");
			const colId = getID(node, "data-col-id");
			if (id && props.api && colId) {
				const col = props.api.getColumn(colId);
				return { id, col, target: node };
			}
		}
		node = node.parentNode;
	}
	return { id: null, col: null, target: null };
}

watchEffect(() => {
	if (tooltipNode.value) {
		let tooltipCoords = tooltipNode.value.getBoundingClientRect();
		if (tooltipCoords.right >= areaCoords.value.right) {
			pos.value.left =
				areaCoords.value.width - tooltipCoords.width - 5;
		}
		if (tooltipCoords.bottom >= areaCoords.value.bottom) {
			pos.value.top -=
				tooltipCoords.bottom - areaCoords.value.bottom + 2;
		}
	}
});

let timer;
const TIMEOUT = 300;
const debounce = (code) => {
	clearTimeout(timer);
	timer = setTimeout(() => {
		code();
	}, TIMEOUT);
};

function move(e) {
	let { id, target, col } = findAttribute(e.target);
	pos.value = null;
	if (!id) {
		clearTimeout(timer);
		return;
	}
	debounce(() => {
		let text = "";
		if (id) {
			tooltipData.value = getTooltipData(id);
			text = getTooltipText(col);
		}
		let targetCoords = target.getBoundingClientRect();
		areaCoords.value = area.value.getBoundingClientRect();
		const top =
			targetCoords.top + targetCoords.height - areaCoords.value.top;
		const left = e.clientX - areaCoords.value.left;
		pos.value = { top, left, col, text };
	});
}

function getTooltipData(id) {
	return props.api.getRow(id);
}

function getTooltipText(col) {
	if (typeof col.tooltip === "function")
		return col.tooltip(tooltipData.value);
	return getRenderValue(tooltipData.value, col) || "";
}
</script>

<template>
	<div class="wx-area" ref="area" @mousemove="move">
		<div
			v-if="
				pos &&
				pos.col.tooltip !== false &&
				(content || pos.text)
			"
			class="tooltip"
			role="alert"
			tabindex="0"
			ref="tooltipNode"
			:style="`top:${pos.top}px;left:${pos.left}px`"
		>
			<component
				v-if="content"
				:is="content"
				:data="tooltipData"
			/>
			<template v-else>{{ pos.text }}</template>
		</div>
		<slot />
	</div>
</template>

<style scoped>
.wx-area {
	position: relative;
	height: 100%;
	width: 100%;
}
:global(.tooltip) {
	padding: 2px 10px;
	border-radius: 2px;
	box-shadow: var(--wx-box-shadow);
	pointer-events: none;
	position: absolute;
	z-index: 10;
	font-size: var(--wx-font-size-sm);
	font-family: var(--wx-font-family);
	color: var(--wx-color-primary-font);
	background-color: #1a1e21;
}
</style>
