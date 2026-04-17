<script setup>
defineOptions({ name: "GridInlineEditorsEditor" });

import { computed, inject } from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import { getStyle } from "../../helpers/columnWidth";
import { editors } from "./editors";

const props = defineProps({
	column: {},
	row: {},
});

const api = inject("grid-store");
const { editor } = api.getReactiveState();
const editorVal = subscribe(editor, true);

function save(ignoreFocus) {
	const cell = ignoreFocus
		? null
		: { row: editorVal.value.id, column: editorVal.value.column };
	closeEditor(false, cell);
}

function cancel() {
	closeEditor(true, {
		row: editorVal.value.id,
		column: editorVal.value.column,
	});
}

function updateValue(value) {
	api.exec("editor", { value });
}

function closeEditor(ignore, cell) {
	api.exec("close-editor", { ignore });
	if (cell) {
		api.exec("focus-cell", {
			...cell,
			eventSource: "click",
		});
	}
}

function keyHandler(ev) {
	if (ev.key === "Enter" && editorVal.value) {
		if (props.column.editor.type === "multiselect") {
			updateValue(editorVal.value.value);
		} else {
			cancel();
		}
	}
}

const style = computed(() =>
	getStyle(
		props.column.width,
		props.column.flexgrow,
		props.column.fixed,
		props.column.left,
		props.column.right
	)
);

const editorComponent = computed(() => {
	let ed = props.column.editor;
	if (typeof ed === "function") ed = ed(props.row, props.column);
	let type = typeof ed === "string" ? ed : ed.type;
	return editors[type];
});
</script>

<template>
	<div
		class="wx-cell wx-editor"
		:style="style"
		:role="
			typeof props.row.$parent !== 'undefined' ? 'gridcell' : 'cell'
		"
		:aria-readonly="
			typeof props.row.$parent !== 'undefined'
				? props.column.editor
					? false
					: true
				: undefined
		"
		tabindex="-1"
		@click.stop
		@dblclick.stop
		@keydown="keyHandler"
	>
		<component
			:is="editorComponent"
			:editor="{ ...editorVal }"
			:onsave="save"
			:onapply="updateValue"
			:oncancel="cancel"
			:onaction="({ action, data }) => api.exec(action, data)"
		/>
	</div>
</template>

<style scoped>
.wx-cell {
	box-sizing: border-box;
	padding: 0;
	background-color: var(--wx-background);
	color: var(--wx-color-font);
	position: relative;
	z-index: 2;
}
.wx-cell :deep(.wx-dropdown) {
	border: var(--wx-table-editor-dropdown-border);
	box-shadow: var(--wx-table-editor-dropdown-shadow);
}
</style>
