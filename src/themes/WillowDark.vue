<script setup>
defineOptions({ name: "GridThemesWillowDark" });

import { WillowDark } from "@svar-ui/vue-core";

const props = defineProps({
	fonts: { type: Boolean, default: true },
});
</script>

<template>
    <WillowDark v-if="$slots.default" :fonts="props.fonts">
        <slot />
    </WillowDark>
    <WillowDark v-else :fonts="props.fonts" />
</template>

<style>
.wx-willow-dark-theme {
	/*PLACE HERE*/
	color-scheme: dark;

	--wx-table-select-background: #384047;
	--wx-table-select-color: var(--wx-color-font);
	--wx-table-border: var(--wx-border);
	--wx-table-select-border: inset 3px 0 var(--wx-color-primary);
	--wx-table-header-border: var(--wx-table-border);
	--wx-table-header-cell-border: var(--wx-table-border);
	--wx-table-footer-cell-border: var(--wx-table-border);
	--wx-table-cell-border: var(--wx-table-border);
	--wx-header-font-weight: 600;
	--wx-table-header-background: #20262b;
	--wx-table-fixed-column-border: 3px solid var(--wx-background-alt);
	--wx-table-editor-dropdown-border: var(--wx-border);
	--wx-table-editor-dropdown-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
	--wx-table-drag-over-background: var(--wx-background-alt);
	--wx-table-drag-zone-shadow: 0px 1px 2px var(--wx-background-hover),
		0px 3px 10px var(--wx-background-hover);
}

.wx-willow-dark-theme .wx-table-menu {
	box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
	outline: var(--wx-border);
}
</style>
