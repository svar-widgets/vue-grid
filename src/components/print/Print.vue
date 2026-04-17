<script setup>
defineOptions({ name: "GridPrintPrint", inheritAttrs: false });

import { inject, ref, onMounted, useAttrs } from "vue";
import Grid from "./Grid.vue";
import { getPrintColumns } from "@svar-ui/grid-store";

const props = defineProps({
	config: {},
});

const attrs = useAttrs();

const api = inject("grid-store");
const { _skin: skin, _columns: columns } = api.getState();

const grids = getPrintColumns(columns, props.config);
const node = ref(null);

onMounted(() => {
	const target = document.body;
	target.classList.add("wx-print");

	const cloned = node.value.cloneNode(true);
	target.appendChild(cloned);

	const rule = `@media print { @page { size: ${props.config.paper} ${props.config.mode}; }`;
	const style = document.createElement("style");
	style.setAttribute("type", "text/css");
	style.setAttribute("media", "print");
	document.getElementsByTagName("head")[0].appendChild(style);
	style.appendChild(document.createTextNode(rule));

	window.print();

	style.remove();
	target.classList.remove("wx-print");

	cloned.remove();
});
</script>

<template>
	<div :class="`wx-${skin}-theme wx-print-container`" ref="node">
		<div
			v-for="(cols, index) in grids"
			:key="index"
			class="wx-print-grid-wrapper"
		>
			<Grid :columns="cols" v-bind="attrs" />
		</div>
	</div>
</template>

<style scoped>
:global(.wx-print-container) {
	display: none;
}

:global(.wx-print-grid) {
	border-collapse: collapse;
	table-layout: fixed;
	border: var(--wx-table-border);
	border-spacing: 0;
	text-indent: initial;
	print-color-adjust: exact;
	-webkit-print-color-adjust: exact;
}

:global(.wx-print-grid tr, .wx-print-grid th, .wx-print-grid td) {
	border: var(--wx-table-border);
}

@media print {
	:global(.wx-print > *) {
		display: none !important;
	}

	:global(.wx-print-container > .wx-print-grid-wrapper) {
		page-break-after: always;
		break-after: page;
	}

	:global(.wx-print-container) {
		display: block !important;
	}
}
</style>
