<script setup>
defineOptions({ name: "GridPrintGrid" });

import { inject } from "vue";
import {
	getRenderValue,
	getHeaderFooterPrintColumns,
	getPrintCellStyle,
} from "@svar-ui/grid-store";
import HeaderFooter from "./HeaderFooter.vue";

const props = defineProps({
	columns: {},
	rowStyle: { type: Function },
	columnStyle: { type: Function },
	cellStyle: { type: Function },
	header: { type: Boolean },
	footer: { type: Boolean },
	reorder: { type: Boolean },
});

const api = inject("grid-store");
const { flatData: data, _sizes: sizes } = api.getState();

const headerColumns =
	props.header &&
	getHeaderFooterPrintColumns(
		props.columns,
		"header",
		sizes.headerRowHeights
	);
const footerColumns =
	props.footer &&
	getHeaderFooterPrintColumns(
		props.columns,
		"footer",
		sizes.footerRowHeights
	);

function buildCellCss(row, column) {
	let css = "";
	css += props.columnStyle ? " " + props.columnStyle(column) : "";
	css += props.cellStyle ? " " + props.cellStyle(row, column) : "";
	return css;
}

function isDraggableIcon(row, column) {
	return typeof column.draggable === "function"
		? column.draggable(row, column) !== false
		: column.draggable;
}
</script>

<template>
	<table
		class="wx-print-grid"
		:class="{ 'wx-flex-columns': columns.some((c) => c.flexgrow) }"
	>
		<thead v-if="header">
			<HeaderFooter
				:columns="headerColumns"
				type="header"
				:column-style="columnStyle"
			/>
		</thead>

		<tbody>
			<tr
				v-for="row in data"
				:key="row.id"
				:class="'wx-row' + (rowStyle ? ' ' + rowStyle(row) : '')"
				:style="`height:${row.rowHeight || sizes.rowHeight}px;`"
			>
				<td
					v-for="column in columns"
					v-show="!column.collapsed"
					:key="column.id"
					:class="
						'wx-print-cell wx-cell' + buildCellCss(row, column)
					"
					:style="getPrintCellStyle(column, sizes.columnWidth)"
				>
					<span
						v-if="reorder && column.draggable"
						class="wx-print-draggable"
					>
						<i
							v-if="isDraggableIcon(row, column)"
							class="wxi-drag"
						></i>
					</span>
					<template v-if="column.treetoggle">
						<span
							:style="`margin-left:${row.$level * 28}px;`"
						></span>
						<i
							v-if="row.$count"
							:class="
								'wx-print-grid-tree-toggle wxi-menu-' +
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
					/>
					<span v-else>{{ getRenderValue(row, column) }}</span>
				</td>
			</tr>
		</tbody>

		<tfoot v-if="footer">
			<HeaderFooter
				:columns="footerColumns"
				type="footer"
				:column-style="columnStyle"
			/>
		</tfoot>
	</table>
</template>

<style scoped>
.wx-flex-columns {
	width: 100%;
}
</style>
