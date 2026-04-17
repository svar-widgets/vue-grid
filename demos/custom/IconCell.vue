<script setup>
const props = defineProps({
	row: {},
	column: {},
	onaction: { type: Function },
});

function onClick() {
	props.onaction?.({
		action: "custom-icon",
		data: {
			column: props.column.id,
			row: props.row.id,
		},
	});
}
</script>

<template>
	<div class="table_icon" :data-action-id="row.id" @click="onClick">
		<i class="wxi-dots-h"></i>
	</div>
</template>

<style scoped>
.table_icon {
	height: 20px;
	cursor: pointer;
	font-size: 18px;
	text-align: center;
}
</style>
