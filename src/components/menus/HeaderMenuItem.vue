<script setup>
const props = defineProps({
	item: {},
});
</script>

<template>
	<div
		tabindex="-1"
		role="menuitem"
		:aria-label="
			props.item.hidden
				? `Show ${props.item.text} column`
				: `Hide ${props.item.text} column`
		"
	>
		<div class="wx-icon" :class="{ 'wx-hidden': !!props.item.hidden }">
			<i class="wxi-eye"></i>
		</div>
		&nbsp;
		<span>{{ props.item.text }}</span>
	</div>
</template>

<style scoped>
.wx-icon {
	display: inline-block;
	vertical-align: middle;
	margin-right: 4px;
}

.wx-hidden {
	color: var(--wx-color-font-disabled);
}
</style>
