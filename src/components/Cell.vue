<script setup>
defineOptions({ name: "GridCell" });

import { computed, ref, watch, onUnmounted, inject } from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import { getStyle } from "../helpers/columnWidth";
import { getRenderValue } from "@svar-ui/grid-store";
import { setID } from "@svar-ui/lib-dom";

const props = defineProps({
	row: {},
	column: {},
	cellStyle: { default: null },
	columnStyle: { default: null },
	focusable: {},
});

const api = inject("grid-store");
const { focusCell, search, reorder } = api.getReactiveState();

const focusCellVal = subscribe(focusCell);
const searchVal = subscribe(search);
const reorderVal = subscribe(reorder);

const style = computed(() =>
	getStyle(
		props.column.width,
		props.column.flexgrow,
		props.column.fixed,
		props.column.left,
		props.column.right
	)
);

const css = computed(() => buildCellCss(props.columnStyle, props.cellStyle));

const shouldHighlight = computed(
	() =>
		searchVal.value?.rows[props.row.id] &&
		searchVal.value.rows[props.row.id][props.column.id]
);

const isDraggable = computed(() =>
	typeof props.column.draggable === "function"
		? props.column.draggable(props.row, props.column) !== false
		: props.column.draggable
);

const cellEl = ref(null);

watch(
	[focusCellVal, () => props.focusable],
	() => {
		if (cellEl.value && props.focusable) {
			const needFocus =
				focusCellVal.value?.row === props.row.id &&
				focusCellVal.value?.column === props.column.id;
			if (needFocus) cellEl.value.focus();
		}
	}
);

function buildCellCss(columnStyle, cellStyle) {
	let css = "wx-cell";
	css += props.column.fixed
		? " " + (props.column.fixed === -1 ? "wx-shadow" : "wx-fixed")
		: "";
	css += columnStyle ? " " + columnStyle(props.column) : "";
	css += cellStyle ? " " + cellStyle(props.row, props.column) : "";
	css += props.column.treetoggle ? " wx-tree-cell" : "";
	return css;
}

function toggleFocusAction() {
	if (props.focusable && !focusCellVal.value) {
		api.exec("focus-cell", {
			row: props.row.id,
			column: props.column.id,
			eventSource: "focus",
		});
	}
}

let focusableLocal = props.focusable;

onUnmounted(() => {
	if (focusableLocal && focusCellVal.value) {
		api.exec("focus-cell", { eventSource: "destroy" });
		focusableLocal = false;
	}
});

function highlightText(text) {
	const regex = new RegExp(`(${searchVal.value.value.trim()})`, "gi");
	const parts = String(text).split(regex);

	return parts.map((text) => ({ text, highlight: regex.test(text) }));
}
</script>

<template>
	<div
		:class="[
			css,
			{
				'wx-shadow':
					(column.fixed && column.fixed.left === -1) ||
					column.fixed.right === -1,
				'wx-fixed-right': column.fixed && column.fixed.right,
			},
		]"
		ref="cellEl"
		:onfocus="toggleFocusAction"
		:style="style"
		:data-row-id="setID(row.id)"
		:data-col-id="setID(column.id)"
		:tabindex="focusable ? '0' : '-1'"
		role="gridcell"
		:aria-colindex="column._colindex"
		:aria-readonly="!column.editor ? true : undefined"
	>
		<template v-if="reorderVal && column.draggable">
			<i
				v-if="isDraggable"
				draggable-data="true"
				class="wx-draggable wxi-drag"
			></i>
			<i v-else class="wx-draggable-stub"></i>
		</template>
		<template v-if="column.treetoggle">
			<span :style="`margin-left:${row.$level * 28}px;`"></span>
			<i
				v-if="row.$count"
				data-action="toggle-row"
				:class="
					'wx-table-tree-toggle wxi-menu-' +
					(row.open !== false ? 'down' : 'right')
				"
			></i>
		</template>
		<component
			v-if="column.cell"
			:is="column.cell"
			:api="api"
			:row="row"
			:column="column"
			:onaction="({ action, data }) => api.exec(action, data)"
		/>
		<slot v-else-if="$slots.default" />
		<span v-else-if="shouldHighlight">
			<template
				v-for="(item, idx) in highlightText(
					getRenderValue(row, column)
				)"
				:key="idx"
			>
				<mark v-if="item.highlight" class="wx-search">{{
					item.text
				}}</mark>
				<template v-else>{{ item.text }}</template>
			</template>
		</span>
		<template v-else>{{ getRenderValue(row, column) }}</template>
	</div>
</template>

<style scoped>
:global(.wx-measure-cell-body),
:global(.wx-print-cell),
.wx-cell {
	background: inherit;
	box-sizing: border-box;
	padding: 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
:global(.wx-print-tree-cell),
.wx-tree-cell {
	display: flex;
}

:global(.wx-measure-cell-body),
.wx-cell:not(:last-child) {
	border-right: var(--wx-table-cell-border);
}

:global(.wx-print-draggable),
.wx-draggable,
.wx-draggable-stub {
	display: inline-block;
	vertical-align: middle;
	margin-right: 3px;
	font-size: 20px;
	height: 20px;
	width: 20px;
}

.wx-draggable {
	cursor: move;
}

.wx-shadow.wx-cell {
	border-right: var(--wx-table-fixed-column-border);
	clip-path: inset(0px -15px 0px 0px);
	z-index: 1;
}

.wx-fixed-right.wx-shadow.wx-cell {
	border-right: var(--wx-table-cell-border);
	border-left: var(--wx-table-fixed-column-border);
}
.wx-fixed-right.wx-shadow.wx-cell:last-child {
	border-right: none;
}

:global(.wx-print-grid-tree-toggle),
.wx-table-tree-toggle {
	font-size: 20px;
	cursor: pointer;
	margin: 0 4px 0 0;
	display: inline-block;
}

.wx-cell[tabindex="0"]:focus {
	outline: 1px solid var(--wx-color-primary);
	outline-offset: -1px;
}

.wx-search {
	background-color: #ffeb3b;
}
</style>
