<script setup>
defineOptions({ name: "GridLayout" });

import { ref, computed, watchEffect, watch, onMounted, onUnmounted, inject, nextTick } from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import { asDirective } from "@svar-ui/lib-vue";
import { onresize } from "../helpers/actions/onresize";
import { reorder as drag, getOffset } from "../helpers/actions/reorder";
import {
	resetAutoScroll,
	tryAutoScroll,
} from "../helpers/actions/dragscroll";
import {
	clickOutside,
	delegateClick,
	locate,
	setID,
	locateID,
	getID,
} from "@svar-ui/lib-dom";

import { hotkeys as hotkeysAction, defaultHotkeys } from "@svar-ui/grid-store";
import { scrollTo } from "@svar-ui/grid-store";

import Cell from "./Cell.vue";
import HeaderFooter from "./HeaderFooter.vue";
import Overlay from "./Overlay.vue";
import Editor from "./inlineEditors/Editor.vue";
import Print from "./print/Print.vue";

const vOnresize = asDirective(onresize);
const vDrag = asDirective(drag);
const vHotkeys = asDirective(hotkeysAction);
const vScrollTo = asDirective(scrollTo);
const vClickOutside = asDirective(clickOutside);
const vDelegateClick = asDirective(delegateClick);

const props = defineProps({
	header: {},
	footer: {},
	overlay: {},
	multiselect: {},
	onreorder: { type: Function },
	rowStyle: { type: Function },
	columnStyle: { type: Function },
	cellStyle: { type: Function },
	autoRowHeight: {},
	resize: {},
	clientWidth: {},
	clientHeight: {},
	responsiveLevel: {},
	hotkeys: {},
});

const api = inject("grid-store");

const {
	dynamic,
	_columns,
	flatData: data,
	split,
	_sizes,
	selectedRows,
	select,
	editor,
	scroll,
	scrollLeft,
	scrollTop,
	tree,
	focusCell,
	_print,
	undo,
	reorder,
	_rowHeightFromData,
} = api.getReactiveState();

const dynamicVal = subscribe(dynamic);
const _columnsVal = subscribe(_columns);
const dataVal = subscribe(data);
const splitVal = subscribe(split);
const _sizesVal = subscribe(_sizes);
const selectedRowsVal = subscribe(selectedRows);
const selectVal = subscribe(select);
const editorVal = subscribe(editor);
const scrollLeftVal = subscribe(scrollLeft);
const scrollTopVal = subscribe(scrollTop);
const treeVal = subscribe(tree);
const focusCellVal = subscribe(focusCell);
const _printVal = subscribe(_print);
const undoVal = subscribe(undo);
const reorderVal = subscribe(reorder);
const _rowHeightFromDataVal = subscribe(_rowHeightFromData);

// will be calculated once, after rendering
const SCROLLSIZE = ref(0);
onMounted(() => (SCROLLSIZE.value = getScrollSize()));

const bodyClientHeight = ref(0);
const bodyEl = ref(null);
let bodyResizeObserver;

onMounted(() => {
	bodyResizeObserver = new ResizeObserver(entries => {
		bodyClientHeight.value = entries[0].target.clientHeight;
	});
	if (bodyEl.value) bodyResizeObserver.observe(bodyEl.value);
});

onUnmounted(() => {
	bodyResizeObserver?.disconnect();
});

const hasAny = computed(() => {
	return _columnsVal.value.some(col => !col.hidden && col.flexgrow);
});

const defaultRowHeight = computed(() => _sizesVal.value.rowHeight);
const tableNode = ref(null);

// reorder
const dragItem = ref(null);
const dragNode = ref(null);

const fullHeight = computed(() => {
	const count = dynamicVal.value ? dynamicVal.value.rowCount : dataVal.value.length;

	if (props.autoRowHeight) {
		return (
			renderedHeight.value +
			renderRows.value.d +
			(count - renderEnd.value) * defaultRowHeight.value
		);
	}
	if (!_rowHeightFromDataVal.value) {
		return count * defaultRowHeight.value;
	}

	let totalHeight = 0;
	for (let i = 0; i < count; i++)
		totalHeight += dataVal.value[i].rowHeight || defaultRowHeight.value;

	return totalHeight;
});

const fullWidth = computed(() =>
	_columnsVal.value.reduce((acc, col) => {
		if (!col.hidden) {
			acc += col.width;
		}
		return acc;
	}, 0)
);

// mark split left columns
const leftColumns = computed(() => {
	let columns = [];
	let width = 0;

	if (splitVal.value.left) {
		columns = _columnsVal.value
			.slice(0, splitVal.value.left)
			.filter(c => !c.hidden)
			.map(a => ({ ...a }));
		columns.forEach(a => {
			a.fixed = { left: 1, leftSize: splitVal.value.left };
			a.left = width;
			width += a.width;
		});
		if (columns.length)
			columns[columns.length - 1].fixed.left = -1;
	}

	return { columns, width };
});

// mark split right columns
const rightColumns = computed(() => {
	let columns = [];
	let width = 0;

	if (splitVal.value.right) {
		columns = _columnsVal.value
			.slice(splitVal.value.right * -1)
			.filter(c => !c.hidden)
			.map(a => ({ ...a }));
		for (let i = columns.length - 1; i >= 0; i--) {
			const col = columns[i];
			col.fixed = { right: 1 };
			col.right = width;
			width += col.width;
		}
		if (columns.length) columns[0].fixed = { right: -1 };
	}

	return { columns, width };
});

const centerColumns = computed(() => {
	const center = _columnsVal.value
		.slice(splitVal.value.left, _columnsVal.value.length - (splitVal.value.right ?? 0))
		.filter(c => !c.hidden);
	center.forEach(a => {
		a.fixed = 0;
	});
	return center;
});

const EXTRACOLUMNS = 1;
const renderColumns = computed(() => {
	let dataC, headerC, footerC;

	// get visible columns
	const left = scrollLeftVal.value;
	const right = scrollLeftVal.value + props.clientWidth;

	let start = 0;
	let end = 0;
	let sum = 0;

	let d = 0;
	centerColumns.value.forEach((col, index) => {
		if (left > sum) {
			start = index;
			d = sum;
		}
		sum = sum + col.width;

		if (right > sum) end = index + EXTRACOLUMNS;
	});

	// header and footer cells correction depending on colSpans
	const rightSpanDelta = { header: 0, footer: 0 };
	for (let i = end; i >= start; i--) {
		["header", "footer"].forEach(key => {
			if (centerColumns.value[i])
				centerColumns.value[i][key].forEach(hCell => {
					const colspan = hCell.colspan;
					if (colspan && colspan > 1) {
						const diff = colspan - (end - i + 1);
						if (diff > 0) {
							rightSpanDelta[key] = Math.max(
								rightSpanDelta[key],
								diff
							);
						}
					}
				});
		});
	}

	// include visible header/footer spans
	const headerPos = getHeaderPosition(start, d, "header");
	const footerPos = getHeaderPosition(start, d, "footer");

	const dh = headerPos.delta;
	const csH = headerPos.index;

	const df = footerPos.delta;
	const csF = footerPos.index;

	const renderAll = hasAny.value && fullWidth.value > props.clientWidth;
	if (renderAll) {
		dataC =
			headerC =
			footerC =
				[
					...leftColumns.value.columns,
					...centerColumns.value,
					...rightColumns.value.columns,
				];
	} else {
		dataC = [
			...leftColumns.value.columns,
			...centerColumns.value.slice(start, end + 1),
			...rightColumns.value.columns,
		];
		headerC = [
			...leftColumns.value.columns,
			...centerColumns.value.slice(csH, end + rightSpanDelta.header + 1),
			...rightColumns.value.columns,
		];
		footerC = [
			...leftColumns.value.columns,
			...centerColumns.value.slice(csF, end + rightSpanDelta.footer + 1),
			...rightColumns.value.columns,
		];
	}

	return renderAll
		? { data: dataC, header: headerC, footer: footerC, d: 0, df: 0, dh: 0 }
		: { data: dataC, header: headerC, footer: footerC, d, df, dh };
});

const headerHeight = computed(() => props.header ? _sizesVal.value.headerHeight : 0);
const footerHeight = computed(() =>
	props.footer && dataVal.value.length ? _sizesVal.value.footerHeight : 0
);

const hasHScroll = computed(() =>
	props.clientWidth && props.clientHeight ? fullWidth.value >= props.clientWidth : false
);
const hasVScroll = ref(false);

function setVScroll() {
	hasVScroll.value =
		props.clientWidth && props.clientHeight
			? fullHeight.value + headerHeight.value + footerHeight.value >=
				props.clientHeight - (fullWidth.value >= props.clientWidth ? SCROLLSIZE.value : 0)
			: false;
}

watch(bodyClientHeight, () => {
	requestAnimationFrame(setVScroll);
});
watch(() => props.clientHeight, () => {
	setVScroll();
});

const contentWidth = computed(() =>
	hasAny.value && fullWidth.value <= props.clientWidth
		? props.clientWidth - (hasVScroll.value ? SCROLLSIZE.value : 0)
		: fullWidth.value
);

// set global width
const globalWidth = computed(() =>
	hasAny.value && fullWidth.value <= props.clientWidth
		? props.clientWidth
		: contentWidth.value < props.clientWidth
			? fullWidth.value + (hasVScroll.value ? SCROLLSIZE.value : 0)
			: -1
);

const bodyContentHeight = computed(() =>
	footerHeight.value
		? Math.min(bodyClientHeight.value + 1, visibleRowsHeight.value - +props.footer)
		: visibleRowsHeight.value
);

// how many rows visible
const visibleRowsHeight = computed(() =>
	props.clientHeight -
		headerHeight.value -
		footerHeight.value -
		(hasHScroll.value ? SCROLLSIZE.value : 0)
);

const visibleRows = computed(() =>
	Math.ceil(visibleRowsHeight.value / defaultRowHeight.value) + 1
);

// request data if necessary
const EXTRAROWS = 2;
const renderRows = computed(() => {
	let start = 0,
		deltaTop = 0;
	if (props.autoRowHeight) {
		let st = scrollTopVal.value;
		while (st > 0) {
			st -= rowHeights[start] || defaultRowHeight.value;
			start++;
		}

		// space to first rendered row
		deltaTop = scrollTopVal.value - st;
		for (let i = Math.max(0, start - EXTRAROWS - 1); i < start; i++)
			deltaTop -= rowHeights[start - i] || defaultRowHeight.value;

		start = Math.max(0, start - EXTRAROWS);
	} else {
		if (_rowHeightFromDataVal.value) {
			let startInd = 0;
			let topHeight = 0;
			for (let i = 0; i < dataVal.value.length; i++) {
				const height = dataVal.value[i].rowHeight || defaultRowHeight.value;
				if (topHeight + height > scrollTopVal.value) {
					startInd = i;
					break;
				}
				topHeight += height;
			}
			start = Math.max(0, startInd - EXTRAROWS);

			for (let i = 0; i < start; i++) {
				deltaTop += dataVal.value[i].rowHeight || defaultRowHeight.value;
			}

			let visibleRowsCount = 0;
			let currentHeight = 0;
			for (let i = startInd + 1; i < dataVal.value.length; i++) {
				const height = dataVal.value[i].rowHeight || defaultRowHeight.value;
				visibleRowsCount++;
				if (currentHeight + height > visibleRowsHeight.value) {
					break;
				}
				currentHeight += height;
			}

			const end = Math.min(
				dynamicVal.value ? dynamicVal.value.rowCount : dataVal.value.length,
				startInd + visibleRowsCount + EXTRAROWS
			);

			return { d: deltaTop, start, end };
		}

		start = Math.floor(scrollTopVal.value / defaultRowHeight.value);
		start = Math.max(0, start - EXTRAROWS);
		deltaTop = start * defaultRowHeight.value;
	}

	const end = Math.min(
		dynamicVal.value ? dynamicVal.value.rowCount : dataVal.value.length,
		start + visibleRows.value + EXTRAROWS
	);

	return { d: deltaTop, start, end };
});

let lastCall = {};
watchEffect(() => {
	if (
		dynamicVal.value &&
		(lastCall.start !== renderRows.value.start ||
			lastCall.end !== renderRows.value.end)
	) {
		const { start, end } = renderRows.value;
		lastCall = { start, end };
		api.exec("request-data", { row: { start, end } });
	}
});

const dataRows = computed(() => {
	if (dynamicVal.value) return dataVal.value;
	else {
		return dataVal.value.slice(renderRows.value.start, renderRows.value.end);
	}
});

// get visible selection
const visibleSelection = computed(() =>
	selectedRowsVal.value.filter(s => dataRows.value.some(r => r.id === s))
);

const renderStart = computed(() => renderRows.value.start);
const renderEnd = ref();

function onScroll(ev) {
	const top = ev.target.scrollTop;
	const left = ev.target.scrollLeft;
	if (top !== scrollTopVal.value || left !== scrollLeftVal.value)
		api.exec("scroll-to", { top, left });
}

function lockSelection(ev) {
	if (ev.shiftKey) ev.preventDefault();
	tableNode.value.focus();
}

function checkDraggable() {
	return !!_columnsVal.value.find(c => !!c.draggable);
}

let postDrag;
let movementY;

const bodyClickHandlers = {
	dblclick: (rowId, ev) => {
		const data = { id: rowId, column: locateID(ev, "data-col-id") };
		api.exec("open-editor", data);
	},
	click: (rowId, ev) => {
		if (postDrag) return;
		const column = locateID(ev, "data-col-id");
		if (focusCellVal.value?.id !== rowId)
			api.exec("focus-cell", {
				row: rowId,
				column,
				eventSource: "click",
			});

		if (selectVal.value === false) return;

		const toggle = props.multiselect && (ev.ctrlKey || ev.metaKey);
		const range = props.multiselect && ev.shiftKey;

		if (
			toggle ||
			selectedRowsVal.value.length > 1 ||
			!selectedRowsVal.value.includes(rowId)
		) {
			api.exec("select-row", { id: rowId, toggle, range });
		}
	},
	"toggle-row": rowId => {
		const row = api.getRow(rowId);
		api.exec(row.open !== false ? "close-row" : "open-row", { id: rowId });
	},
	"ignore-click": () => {
		return false;
	},
};

const dragScrollConfig = computed(() => ({
	top: headerHeight.value,
	bottom: footerHeight.value,
	left: leftColumns.value.width,
	xScroll: hasHScroll.value,
	yScroll: hasVScroll.value,
	sense:
		props.autoRowHeight && dragNode.value
			? dragNode.value.offsetHeight
			: Math.max(_sizesVal.value.rowHeight, 40),
	node: tableNode.value && tableNode.value.firstElementChild,
}));

function startDrag(ev, context) {
	const { container, sourceNode, from } = context;
	const hasDraggable = checkDraggable();

	if (hasDraggable && !sourceNode.getAttribute("draggable-data"))
		return false;

	dragItem.value = from;

	if (treeVal.value && api.getRow(dragItem.value).open)
		api.exec("close-row", { id: dragItem.value, nested: true });

	// default to drag source (target may be shifted by this moment)
	const itemNode = locate(sourceNode);
	dragNode.value = itemNode.cloneNode(true);
	dragNode.value.classList.remove("wx-selected");
	dragNode.value
		.querySelectorAll("[tabindex]")
		.forEach(element => element.setAttribute("tabindex", "-1"));
	container.appendChild(dragNode.value);

	const offsetX = scrollLeftVal.value - renderColumns.value.d;
	const vScrollSize = hasVScroll.value ? SCROLLSIZE.value : 0;

	container.style.width =
		Math.min(
			props.clientWidth - vScrollSize,
			hasAny.value && fullWidth.value <= props.clientWidth
				? contentWidth.value
				: contentWidth.value - vScrollSize
		) +
		offsetX +
		"px";

	const itemPos = getOffset(itemNode);
	context.offset = {
		x: offsetX,
		y: -Math.round(itemPos.height / 2),
	};

	if (!movementY) movementY = ev.clientY;
}

function moveDrag(ev, context) {
	const { from } = context;
	const pos = context.pos;
	const box = getOffset(tableNode.value);

	pos.x = box.x;

	const min = dragScrollConfig.value.top;
	if (pos.y < min) pos.y = min;
	else {
		const max =
			box.height -
			(hasHScroll.value && SCROLLSIZE.value > 0
				? SCROLLSIZE.value
				: Math.round(dragScrollConfig.value.sense / 2)) -
			dragScrollConfig.value.bottom;
		if (pos.y > max) pos.y = max;
	}

	if (tableNode.value.contains(context.targetNode)) {
		const targetRow = locate(context.targetNode);
		const to = targetRow && getID(targetRow);

		if (to && to !== from) {
			context.to = to;

			const rowHeight = props.autoRowHeight
				? dragNode.value?.offsetHeight
				: _sizesVal.value.rowHeight;

			if (scrollTopVal.value === 0 || pos.y > min + rowHeight - 1) {
				const targetRect = targetRow.getBoundingClientRect();
				const dragNodeOffset = getOffset(dragNode.value);

				const dragNodePos = dragNodeOffset.y;
				const targetNodePos = targetRect.y;

				const dir = dragNodePos > targetNodePos ? -1 : 1;
				const initialMode = dir === 1 ? "after" : "before";
				const flat = api.getState().flatData;
				const diff = Math.abs(
					flat.findIndex(r => r.id === from) -
						flat.findIndex(r => r.id === to)
				);

				const mode =
					diff !== 1
						? initialMode === "before"
							? "after"
							: "before"
						: initialMode;

				if (diff === 1) {
					// prevent moving items near borders
					if (dir === -1 && ev.clientY > movementY) return;
					if (dir === 1 && ev.clientY < movementY) return;
				}

				movementY = ev.clientY;

				api.exec("move-item", {
					id: from,
					target: to,
					mode,
					inProgress: true,
				});
			}
		}

		props.onreorder && props.onreorder({ event: ev, context });
	}

	tryAutoScroll(ev, box, context, dragScrollConfig.value);
}

function endDrag(ev, context) {
	const { from, to } = context;

	api.exec("move-item", {
		id: from,
		target: to,
		inProgress: false,
	});

	// block potential clicks after mouseup
	postDrag = setTimeout(() => {
		postDrag = 0;
	}, 1);

	dragItem.value = dragNode.value = movementY = null;
	resetAutoScroll(context);
}

// for header and footer (e.g. type): include visible spans
function getHeaderPosition(start, deltaLeft, type) {
	let delta = deltaLeft;
	let index = start;

	if (centerColumns.value.length) {
		let spanStartInd = centerColumns.value.length; // max value to compare with
		// find min index of the column which colspan is visible
		for (let i = start; i >= 0; i--) {
			const colHeader = centerColumns.value[i][type];
			colHeader.forEach(h => {
				if (
					h.colspan > 1 &&
					i > start - h.colspan &&
					i < spanStartInd
				) {
					spanStartInd = i;
				}
			});
		}

		if (spanStartInd !== centerColumns.value.length && spanStartInd < start) {
			for (let i = spanStartInd; i < start; i++) {
				delta -= centerColumns.value[i].width;
			}
			index = spanStartInd;
		}
	}

	return { index, delta };
}

function getScrollSize() {
	const div = document.createElement("div");
	div.style.cssText =
		"position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;min-height:100px;overflow-y:scroll;";
	document.body.appendChild(div);
	const width = div.offsetWidth - div.clientWidth;
	document.body.removeChild(div);
	return width;
}

// with at least one flexible column, size the box to 100% to match the container
const style = computed(() =>
	hasAny.value && fullWidth.value <= props.clientWidth
		? "width:100%;"
		: globalWidth.value > 0
			? `width:${globalWidth.value}px;`
			: ""
);

const dataEl = ref(null);
let rowHeights = [];
const renderedHeight = ref(0);
function adjustHeight() {
	// make sure the UI is updated before syncing the state
	nextTick().then(() => {
		let rh = 0;
		let re = renderStart.value;
		Array.from(dataEl.value.children).forEach((row, i) => {
			rowHeights[renderStart.value + i] = row.offsetHeight;
			rh += row.offsetHeight;
			re++;
		});

		renderedHeight.value = rh;
		renderEnd.value = re;
	});
}

watchEffect(() => dataRows.value && props.autoRowHeight && adjustHeight());

watch([renderColumns, dataRows], () => {
	if (focusCellVal.value) {
		const rowExists = dataRows.value.some(
			row => row.id === focusCellVal.value.row
		);
		const cellExists =
			rowExists &&
			renderColumns.value.data.some(
				col => col.id === focusCellVal.value.column && !col.collapsed
			);
		if (!cellExists) {
			api.exec("focus-cell", { eventSource: "destroy" });
		}
	}
});

/* focus is a focusable cell which either belongs to visible selection
   or is the first visible cell in grid, which maybe scrolled up due to EXTRAROWS
   If select is false, focusCell can be outside selection*/
const focus = ref();

watchEffect(() => {
	if (
		focusCellVal.value &&
		(!selectVal.value ||
			!visibleSelection.value.length ||
			visibleSelection.value.includes(focusCellVal.value.row))
	)
		focus.value = { ...focusCellVal.value };
	else if (dataRows.value.length && renderColumns.value.data.length) {
		if (
			!focus.value ||
			(visibleSelection.value.length &&
				!visibleSelection.value.includes(focus.value.row)) ||
			dataRows.value.findIndex(r => r.id === focus.value.row) === -1 ||
			renderColumns.value.data.findIndex(
				c => c.id === focus.value.column && !c.collapsed
			) === -1
		) {
			const row = visibleSelection.value[0] || dataRows.value[0].id;
			const cind = renderColumns.value.data.findIndex(c => !c.collapsed);
			if (cind !== -1)
				focus.value = { row, column: renderColumns.value.data[cind].id };
			else focus.value = null;
		}
	} else focus.value = null;
});

const viewportWidth = computed(() =>
	(globalWidth.value > 0 ? globalWidth.value : props.clientWidth) -
		(hasVScroll.value ? SCROLLSIZE.value : 0)
);

const scrollToConfig = computed(() => ({
	scroll,
	scrollLeft,
	scrollTop,
	getWidth: () => props.clientWidth - (hasVScroll.value ? SCROLLSIZE.value : 0),
	getHeight: () => visibleRowsHeight.value,
	getScrollMargin: () => leftColumns.value.width + rightColumns.value.width,
}));

const dragConfig = computed(() => ({
	start: startDrag,
	move: moveDrag,
	end: endDrag,
	getReorder: () => reorderVal.value,
	getDraggableInfo: () => ({ hasDraggable: checkDraggable() }),
}));

const hotkeysConfigComputed = computed(() => ({
	keys: props.hotkeys !== false && {
		...defaultHotkeys,
		"ctrl+z": undoVal.value,
		"ctrl+y": undoVal.value,
		...props.hotkeys,
	},
	exec: v => api.exec("hotkey", v),
}));

const scrollStyle = computed(() =>
	`overflow-x:${hasHScroll.value ? 'scroll' : 'hidden'};overflow-y:${hasVScroll.value ? 'scroll' : 'hidden'};`
);

const gridClass = computed(() =>
	`wx-grid ${props.responsiveLevel ? `wx-responsive-${props.responsiveLevel}` : ""}`
);

const gridStyle = computed(() =>
	`--header-height:${headerHeight.value}px; --footer-height:${footerHeight.value}px;--split-left-width:${leftColumns.value.width}px;--split-right-width:${rightColumns.value.width}px;`
);

function getRowClass(row) {
	let cls = "wx-row";
	if (props.rowStyle) cls += " " + props.rowStyle(row);
	return cls;
}

function getRowStyle(row) {
	return `${props.autoRowHeight ? "min-height" : "height"}:${row.rowHeight || defaultRowHeight.value}px;`;
}

function isSelected(row) {
	return selectedRowsVal.value.indexOf(row.id) !== -1;
}
</script>

<template>
	<div
		:class="gridClass"
		:style="gridStyle"
	>
		<div
			ref="tableNode"
			class="wx-table-box"
			v-onresize="resize"
			v-drag="dragConfig"
			v-hotkeys="hotkeysConfigComputed"
			:style="style"
			:role="treeVal ? 'treegrid' : 'grid'"
			:aria-colcount="renderColumns.data.length"
			:aria-rowcount="dataRows.length"
			:aria-multiselectable="treeVal && multiselect ? true : undefined"
		>
			<div
				class="wx-scroll"
				:style="scrollStyle"
				:onscroll="onScroll"
				v-scroll-to="scrollToConfig"
			>
				<div v-if="header" class="wx-header-wrapper">
					<HeaderFooter
						:content-width="contentWidth"
						:viewport-width="viewportWidth"
						:delta-left="renderColumns.dh"
						:columns="renderColumns.header"
						:column-style="columnStyle"
						:body-height="bodyContentHeight"
						:left-columns-width="leftColumns.width"
						:right-columns-width="rightColumns.width"
					/>
				</div>
				<div
					ref="bodyEl"
					class="wx-body"
					:style="`width:${contentWidth}px;height:${fullHeight}px;`"
					:onmousedown="(ev) => lockSelection(ev)"
					v-click-outside="() => focusCellVal && api.exec('focus-cell', { eventSource: 'click' })"
					v-delegate-click="bodyClickHandlers"
				>
					<Overlay v-if="overlay" :overlay="overlay" />
					<div
						ref="dataEl"
						class="wx-data"
						:style="`padding-top:${renderRows.d}px;padding-left:${renderColumns.d}px;`"
					>
						<div
							v-for="(row, rIndex) in dataRows"
							:key="row.id"
							:class="[
								getRowClass(row),
								{
									'wx-autoheight': autoRowHeight,
									'wx-selected': isSelected(row),
									'wx-inactive': dragItem === row.id,
								},
							]"
							:data-id="setID(row.id)"
							:data-context-id="setID(row.id)"
							:style="getRowStyle(row)"
							role="row"
							:aria-rowindex="rIndex"
							:aria-expanded="row.open"
							:aria-level="treeVal ? row.$level + 1 : undefined"
							:aria-selected="treeVal ? isSelected(row) : undefined"
							tabindex="-1"
						>
							<template
								v-for="column in renderColumns.data"
								:key="column.id"
							>
								<div
									v-if="column.collapsed"
									class="wx-cell wx-collapsed"
								></div>
								<Editor
									v-else-if="editorVal?.id === row.id && editorVal.column === column.id"
									:row="row"
									:column="column"
								/>
								<Cell
									v-else
									:row="row"
									:column="column"
									:column-style="columnStyle"
									:cell-style="cellStyle"
									:reorder="reorder"
									:focusable="focus?.row === row.id && focus?.column === column.id"
								/>
							</template>
						</div>
					</div>
				</div>
				<HeaderFooter
					v-if="footer && dataVal.length"
					type="footer"
					:content-width="contentWidth"
					:delta-left="renderColumns.df"
					:columns="renderColumns.footer"
					:column-style="columnStyle"
				/>
			</div>
		</div>
	</div>
	<Print
		v-if="_printVal"
		:config="_printVal"
		:row-style="rowStyle"
		:column-style="columnStyle"
		:cell-style="cellStyle"
		:header="header"
		:footer="footer"
		:reorder="reorder"
	/>
</template>

<style scoped>
.wx-grid {
	height: 100%;
}

.wx-table-box {
	outline: none;
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	border: var(--wx-table-cell-border);
	overflow: hidden;
	box-sizing: content-box;
}

.wx-header-wrapper {
	position: sticky;
	z-index: 3;
	top: 0px;
}

.wx-body {
	position: relative;
}

.wx-data {
	position: relative;
}

.wx-scroll {
	position: relative;
	flex: 1;
	scroll-padding-top: var(--header-height);
	scroll-padding-bottom: var(--footer-height);
}

.wx-row {
	display: flex;
	box-sizing: border-box;
	background-color: var(--wx-background);
}

.wx-row:not(:last-child) {
	border-bottom: var(--wx-table-cell-border);
}

.wx-row.wx-autoheight :deep(.wx-cell) {
	overflow: visible;
	text-overflow: initial;
	white-space: normal;
	word-break: break-all;
}

.wx-row.wx-autoheight {
	height: max-content;
}

.wx-selected {
	color: var(--wx-table-select-color);
	background-color: var(--wx-table-select-background);
}

.wx-selected :deep(.wx-cell:first-child) {
	box-shadow: var(--wx-table-select-border);
}

.wx-inactive {
	color: var(--wx-table-drag-over-background);
	background-color: var(--wx-table-drag-over-background);
	--wx-table-select-border: none;
}

:global(.wx-drag-zone) {
	z-index: 10;
	position: absolute;
	pointer-events: none;
	overflow: hidden;
	box-shadow: var(--wx-table-drag-zone-shadow);
}

.wx-cell.wx-collapsed {
	width: 36px;
	border-right: var(--wx-table-cell-border);
}
</style>
