<script setup>
defineOptions({ name: "GridHeaderFooter" });

import { computed, inject } from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import HeaderCell from "./HeaderCell.vue";
import FooterCell from "./FooterCell.vue";
import { isCommunity } from "@svar-ui/grid-store";

const props = defineProps({
	deltaLeft: {},
	contentWidth: {},
	columns: {},
	type: { default: "header" },
	columnStyle: { type: Function },
	bodyHeight: {},
});

const api = inject("grid-store");
const { _sizes: sizes, split } = api.getReactiveState();
const sizesVal = subscribe(sizes);
const splitVal = subscribe(split);

const rowHeights = computed(() => sizesVal.value[`${props.type}RowHeights`]);

const renderedHeader = computed(() => {
	let res = [];
	if (props.columns.length) {
		const rowsCount = props.columns[0][props.type].length;
		for (let ri = 0; ri < rowsCount; ri++) {
			let inSpan = 0;
			res.push([]);
			props.columns.forEach((col, ci) => {
				const cell = { ...col[props.type][ri] };
				if (!inSpan) {
					res[ri].push(cell);
				}

				if (cell.colspan > 1) {
					inSpan = cell.colspan - 1;

					if (!isCommunity()) {
						if (col.right) {
							let right = col.right;
							for (let i = 1; i < cell.colspan; i++) {
								right -= props.columns[ci + i].width;
							}
							cell.right = right;
						}
					}
				} else if (inSpan) inSpan--;
			});
		}
	}
	return res;
});

const hasSplit = computed(
	() => splitVal.value?.left || splitVal.value?.right
);

function getColumn(id) {
	return props.columns.find(c => c.id === id);
}

function isLast(cell, ind) {
	if (cell.rowspan) ind += cell.rowspan - 1;
	return ind === renderedHeader.value.length - 1;
}

function isSort(cell, ind, column) {
	if (!column.sort) return false;
	for (let i = renderedHeader.value.length - 1; i >= 0; i--) {
		const cell = column.header[i];
		if (!cell.filter && !cell._hidden) return ind === i;
	}
	return isLast(cell, ind);
}
</script>

<template>
	<div
		:class="`wx-${props.type}`"
		:style="`padding-left:${props.deltaLeft}px;width:${props.contentWidth}px;`"
		role="rowgroup"
	>
		<div
			v-for="(row, i) in renderedHeader"
			:key="i"
			:class="props.type === 'header' ? 'wx-h-row' : 'wx-f-row'"
			:style="`height:${rowHeights[i]}px; display: flex`"
			role="row"
		>
			<template v-for="cell in row" :key="cell.id">
				<HeaderCell
					v-if="props.type === 'header'"
					:cell="cell"
					:column-style="props.columnStyle"
					:column="getColumn(cell.id)"
					:row="i"
					:last-row="isLast(cell, i)"
					:body-height="props.bodyHeight"
					:sort-row="isSort(cell, i, getColumn(cell.id))"
					:has-split="hasSplit"
				/>
				<FooterCell
					v-else
					:cell="cell"
					:column-style="props.columnStyle"
					:column="getColumn(cell.id)"
					:row="i"
				/>
			</template>
		</div>
	</div>
</template>

<style scoped>
.wx-header,
.wx-footer {
	font-weight: 500;
}

.wx-header {
	top: 0;
	border-bottom: var(--wx-table-header-border);
}

.wx-footer {
	position: sticky;
	z-index: 2;
	bottom: 0;
	border-top: var(--wx-table-header-border);
}
</style>
