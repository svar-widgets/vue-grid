<script setup>
defineOptions({ name: "GridFooterCell" });

import { computed, inject } from "vue";
import { getStyle, getCssName } from "../helpers/columnWidth";

const api = inject("grid-store");

const props = defineProps({
	cell: {},
	column: {},
	row: {},
	columnStyle: { type: Function },
});

const style = computed(() =>
	getStyle(
		props.cell.width,
		props.cell.flexgrow,
		props.column.fixed,
		props.column.left,
		props.cell.right ?? props.column.right,
		props.cell.height
	)
);

const css = computed(() => getCssName(props.column, props.cell, props.columnStyle));

function getCell() {
	return Object.fromEntries(
		Object.entries(props.cell).filter(([key]) => key !== "cell")
	);
}
</script>

<template>
	<div
		:class="['wx-cell', css, props.cell.css || '', { 'wx-fixed-right': props.column.fixed && props.column.fixed.right }]"
		:style="style"
	>
		<template v-if="!props.column.collapsed && !props.cell.collapsed">
			<component
				v-if="props.cell.cell"
				:is="props.cell.cell"
				:api="api"
				:cell="getCell()"
				:column="props.column"
				:row="props.row"
				:onaction="({ action, data }) => api.exec(action, data)"
			/>
			<div v-else class="wx-text">{{ props.cell.text || "" }}</div>
		</template>
	</div>
</template>

<style scoped>
:global(.wx-measure-cell-footer),
:global(.wx-print-cell-footer),
.wx-cell {
	padding: 8px;
	display: flex;
	align-items: center;
	font-weight: var(--wx-header-font-weight);
	background: var(--wx-table-header-background);
	overflow: hidden;
}

:global(.wx-print-cell-footer) {
	display: table-cell;
}

.wx-cell:not(:last-child) {
	border-right: var(--wx-table-footer-cell-border);
}

.wx-cell.wx-vertical {
	align-items: flex-end;
}

:global(.wx-print-cell-footer .wx-text),
.wx-text {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

:global(.wx-print-cell-footer.wx-vertical .wx-text),
.wx-vertical .wx-text {
	transform: rotate(-90deg) translateY(100%);
	transform-origin: left bottom;
	text-overflow: clip;
	overflow: unset;
}

:global(.wx-print-cell-footer.wx-vertical .wx-text) {
	display: block;
}

.wx-cell.wx-shadow {
	clip-path: inset(0px -15px 0px 0px);
	border-right: var(--wx-table-fixed-column-border);
}

.wx-cell.wx-fixed-right.wx-shadow {
	border-right: var(--wx-table-cell-border);
	border-left: var(--wx-table-fixed-column-border);
}

.wx-cell.wx-fixed-right.wx-cell:last-child {
	border-right: none;
}

.wx-shadow,
.wx-fixed {
	z-index: 3;
}

.wx-rowspan {
	z-index: 2;
}

.wx-rowspan.wx-shadow,
.wx-rowspan.wx-fixed,
.wx-colspan.wx-shadow,
.wx-colspan.wx-fixed {
	z-index: 4;
}

:global(.wx-f-row:not(:last-child)) .wx-cell:not(.wx-rowspan) {
	border-bottom: var(--wx-table-header-cell-border);
}
</style>
