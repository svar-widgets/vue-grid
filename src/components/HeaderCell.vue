<script setup>
import { computed, inject } from "vue";
import { subscribe, asDirective } from "@svar-ui/lib-vue";
import { resize } from "../helpers/actions/resize";
import { getCssName, getStyle } from "../helpers/columnWidth";
import Filter from "./inlineFilters/Filter.vue";
import { setID } from "@svar-ui/lib-dom";

const vResize = asDirective(resize);

const api = inject("grid-store");
const { sortMarks } = api.getReactiveState();
const sortMarksRef = subscribe(sortMarks);

const props = defineProps({
	cell: {},
	column: {},
	row: {},
	lastRow: {},
	sortRow: {},
	columnStyle: { type: Function },
	bodyHeight: {},
	hasSplit: {},
});

let start;

const sortMark = computed(() => sortMarksRef.value?.[props.column.id]);

function down(node) {
	start = props.cell.flexgrow ? node.parentNode.clientWidth : props.cell.width;
}

function move(dx) {
	resizeColumn(dx, true);
}

function up(dx) {
	resizeColumn(dx, false);
}

function resizeColumn(dx, inProgress) {
	api.exec("resize-column", {
		id: props.cell.id,
		width: Math.max(1, start + dx),
		inProgress,
	});
}

function sort(ev) {
	if (!props.column.sort || props.cell.filter) return;
	const sm = sortMark.value;
	if (sm?.order) {
		sm.order = sm.order === "asc" ? "desc" : "asc";
	}
	api.exec("sort-rows", {
		key: props.cell.id,
		add: ev.ctrlKey || ev.metaKey,
		order: sm?.order,
	});
}

function collapse(ev) {
	if (ev) ev.stopPropagation();
	api.exec("collapse-column", { id: props.cell.id, row: props.row });
}

function toggleCollapseColumn(ev) {
	if (ev.key === "Enter") collapse();
}

function toggleSortColumn(ev) {
	if (ev.key === "Enter" && !props.cell.filter) sort(ev);
}

const isCollapsed = computed(() => props.cell.collapsed && props.column.collapsed);
const overlay = computed(
	() => isCollapsed.value && !props.hasSplit && props.cell.collapsible !== "header"
);
const collapsedTextStyle = computed(() =>
	overlay.value ? `top:-${props.bodyHeight / 2}px;position:absolute;` : ""
);

const style = computed(() =>
	getStyle(
		props.cell.width,
		props.cell.flexgrow,
		props.column.fixed,
		props.column.left,
		props.cell.right ?? props.column.right,
		props.cell.height + (isCollapsed.value && overlay.value ? props.bodyHeight : 0)
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
		v-if="isCollapsed"
		:class="['wx-cell', css, cell.css || '', 'wx-collapsed']"
		:style="style"
		role="button"
		:aria-label="`Expand column ${cell.text || ''}`"
		:aria-expanded="!cell.collapsed"
		tabindex="0"
		@keydown="toggleCollapseColumn"
		@click="collapse"
		:data-header-id="setID(column.id)"
	>
		<div class="wx-text" :style="collapsedTextStyle">
			{{ cell.text || "" }}
		</div>
	</div>
	<div
		v-else
		:class="['wx-cell', css, cell.css || '', { 'wx-filter': cell.filter, 'wx-fixed-right': column.fixed && column.fixed.right }]"
		:style="style"
		@click="sort"
		:data-header-id="setID(column.id)"
		:tabindex="!cell._hidden && column.sort && !cell.filter ? '0' : undefined"
		role="columnheader"
		:aria-colindex="cell._colindex"
		:aria-colspan="cell.colspan > 1 ? cell.colspan : undefined"
		:aria-rowspan="cell.rowspan > 1 ? cell.rowspan : undefined"
		:aria-sort="!sortMark?.order || cell.filter
			? 'none'
			: sortMark?.order === 'asc'
				? 'ascending'
				: 'descending'"
		@keydown="toggleSortColumn"
	>
		<div
			v-if="cell.collapsible"
			class="wx-collapse"
			role="button"
			:aria-label="cell.collapsed ? 'Expand column' : 'Collapse column'"
			:aria-expanded="!cell.collapsed"
			tabindex="0"
			@keydown="toggleCollapseColumn"
			@click="collapse"
		>
			<i :class="'wxi-angle-' + (cell.collapsed ? 'down' : 'right')"></i>
		</div>

		<component
			v-if="cell.cell"
			:is="cell.cell"
			:api="api"
			:cell="getCell()"
			:column="column"
			:row="row"
			:onaction="({ action, data }) => api.exec(action, data)"
		/>
		<Filter
			v-else-if="cell.filter"
			:filter="cell.filter"
			:column="column"
		/>
		<div v-else class="wx-text">{{ cell.text || "" }}</div>

		<div
			v-if="column.resize && lastRow && !cell._hidden"
			class="wx-grip"
			role="presentation"
			aria-label="Resize column"
			v-resize="{ down, move, up }"
			@click.stop
		>
			<div></div>
		</div>

		<div v-if="sortRow" class="wx-sort">
			<template v-if="sortMark">
				<div v-if="typeof sortMark.index !== 'undefined'" class="wx-order">
					{{ sortMark.index + 1 }}
				</div>
				<i :class="'wxi-arrow-' + (sortMark.order === 'asc' ? 'up' : 'down')"></i>
			</template>
		</div>
	</div>
</template>

<style scoped>
:global(.wx-measure-cell-header),
:global(.wx-print-cell-header),
.wx-cell {
	padding: 8px;
	position: relative;
	display: flex;
	align-items: center;
	font-weight: var(--wx-header-font-weight);
	background: var(--wx-table-header-background);
	line-height: 20px;
}

.wx-cell:focus {
	outline: 1px solid var(--wx-color-primary);
	outline-offset: -1px;
}

:global(.wx-print-cell-header) {
	display: table-cell;
	position: static;
}

.wx-cell.wx-vertical {
	align-items: flex-end;
}

:global(.wx-measure-cell-header),
.wx-cell:not(:last-child) {
	border-right: var(--wx-table-header-cell-border);
}

:global(.wx-print-cell-filter),
.wx-cell.wx-filter {
	padding: 4px;
	z-index: 8;
}

:global(.wx-print-cell-header .wx-text),
.wx-text {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

:global(.wx-print-cell-header.wx-vertical .wx-text),
.wx-vertical .wx-text {
	height: 100%;
	transform: rotate(-180deg);
	writing-mode: vertical-lr;
	text-overflow: ellipsis;
	overflow: hidden;
}

:global(.wx-print-cell-header.wx-vertical .wx-text) {
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
	z-index: 7; /* because colspans have z-index: 6 */
}

.wx-shadow.wx-rowspan,
.wx-shadow.wx-colspan,
.wx-fixed.wx-rowspan,
.wx-fixed.wx-colspan {
	z-index: 8; /* because fixed columns have z-index: 7 */
}

.wx-grip {
	box-sizing: border-box;
	position: absolute;
	top: 0;
	bottom: 0;
	right: -4px;
	width: 9px;
	background-color: transparent;
	opacity: 0;
	cursor: ew-resize;
	z-index: 8;
}
.wx-grip div {
	margin-left: 5px;
	width: 1px;
	height: 100%;
	background-color: var(--wx-color-primary);
}
.wx-cell:last-child .wx-grip {
	width: 5px;
	right: 0;
}
.wx-cell:last-child .wx-grip div {
	margin-left: 4px;
}

.wx-grip::before,
.wx-cell:not(:last-child) .wx-grip::after {
	content: "";
	position: absolute;
	top: 0;
	bottom: 0;
	width: 0;
	height: 0;
	margin: auto;
}

.wx-grip::before {
	border: 3px dashed transparent;
	border-right: 3px solid var(--wx-color-primary);
	right: 7px;
}
.wx-cell:last-child .wx-grip::before {
	right: 3px;
}

.wx-cell:not(:last-child) .wx-grip::after {
	border: 3px dashed transparent;
	border-left: 3px solid var(--wx-color-primary);
	left: 9px;
}

.wx-cell:has(.wx-grip:hover) {
	z-index: 9;
}

.wx-grip:hover {
	opacity: 1;
}

.wx-sort {
	height: 100%;
	margin-left: auto;
	display: flex;
	align-items: center;
}

.wx-order {
	width: 16px;
	height: 16px;
	line-height: 16px;
	border-radius: 50%;
	font-size: 12px;
	text-align: center;
	color: #fff;
	background-color: #3498ff;
}

.wx-collapse:focus {
	outline: none;
}
.wx-collapse:focus i,
.wx-collapse:hover i {
	color: var(--wx-color-primary);
}

.wx-rowspan,
.wx-colspan {
	z-index: 6; /* because resize grips have z-index: 5 */
}

.wx-collapse,
.wx-collapsed {
	cursor: pointer;
	z-index: 1;
}
.wx-collapsed {
	position: relative;
}
.wx-collapse i {
	margin-right: 4px;
}

:global(.wx-h-row:not(:last-child)) .wx-cell:not(.wx-rowspan) {
	border-bottom: var(--wx-table-header-cell-border);
}
</style>
