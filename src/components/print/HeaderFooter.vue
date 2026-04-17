<script setup>
import { inject } from "vue";
import { getPrintCellStyle, getPrintFilterValue } from "@svar-ui/grid-store";

const props = defineProps({
	columns: {},
	type: {},
	columnStyle: { type: Function },
});

const api = inject("grid-store");
const { filterValues, _columns, _sizes: sizes } = api.getState();

function getColumnCss(column) {
	return props.columnStyle ? " " + props.columnStyle(column) : "";
}

function findColumn(cell) {
	return _columns.find(c => c.id === cell.id);
}

function getCellProps(cell) {
	return Object.fromEntries(
		Object.entries(cell).filter(([key]) => key !== "cell")
	);
}
</script>

<template>
	<tr v-for="(row, i) in props.columns" :key="i">
		<th
			v-for="cell in row"
			:key="cell.id"
			:style="getPrintCellStyle(cell, sizes.columnWidth)"
			:class="[
				`wx-print-cell-${props.type}`,
				getColumnCss(findColumn(cell)),
				{
					'wx-print-cell-filter': cell.filter,
					'wx-vertical': cell.vertical,
				},
			]"
			:rowspan="cell.rowspan"
			:colspan="cell.colspan"
		>
			<component
				v-if="cell.cell"
				:is="cell.cell"
				:api="api"
				:cell="getCellProps(cell)"
				:column="findColumn(cell)"
				:row="i"
			/>
			<div v-else-if="cell.filter" class="wx-print-filter">
				{{ getPrintFilterValue(filterValues, _columns, cell) }}
			</div>
			<div v-else class="wx-text">{{ cell.text ?? "" }}</div>
		</th>
	</tr>
</template>

<style scoped>
:global(.wx-print-grid .wx-vertical) {
	vertical-align: bottom;
}
</style>
