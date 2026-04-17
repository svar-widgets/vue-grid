<script setup>
defineOptions({ name: "GridThemesWillow" });

import { Willow } from "@svar-ui/vue-core";

const props = defineProps({
	fonts: { type: Boolean, default: true },
});
</script>

<template>
    <Willow v-if="$slots.default" :fonts="props.fonts">
		<slot />
	</Willow>
	<Willow v-else :fonts="props.fonts" />
</template>

<style>
.wx-willow-theme {
	/*PLACE HERE*/

	--wx-table-select-background: #eaedf5;
	--wx-table-select-color: var(--wx-color-font);
	--wx-table-border: 1px solid #e6e6e6;
	--wx-table-select-border: inset 3px 0 var(--wx-color-primary);
	--wx-table-header-border: var(--wx-table-border);
	--wx-table-header-cell-border: var(--wx-table-border);
	--wx-table-footer-cell-border: var(--wx-table-border);
	--wx-table-cell-border: var(--wx-table-border);
	--wx-header-font-weight: 600;
	--wx-table-header-background: #f2f3f7;
	--wx-table-fixed-column-border: 3px solid #e6e6e6;
	--wx-table-editor-dropdown-border: var(--wx-table-border);
	--wx-table-editor-dropdown-shadow: 0px 4px 20px 0px
		rgba(44, 47, 60, 0.12);
	--wx-table-drag-over-background: var(--wx-background-alt);
	--wx-table-drag-zone-shadow: var(--wx-box-shadow);
}

.wx-willow-theme .wx-table-menu {
	box-shadow: 0px 4px 20px 0px rgba(44, 47, 60, 0.12);
	outline: 1px solid #e6e6e6;
}
</style>
