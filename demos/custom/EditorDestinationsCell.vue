<script setup>
import { computed } from "vue";

const props = defineProps({
	data: {},
});

const countriesCount = computed(() => props.data.length);
</script>

<template>
	<div v-if="Array.isArray(data)" class="list">
		<span>
			<template v-if="countriesCount && countriesCount <= 3">
				{{ data.map(item => item.label).join(", ") }}
			</template>
			<template v-else-if="countriesCount > 3">
				{{
					data
						.slice(0, 3)
						.map(item => item.label)
						.join(", ")
				}}
				and {{ countriesCount - 3 }} more
			</template>
			<span v-else class="empty">not selected</span>
		</span>
	</div>
	<div v-else class="custom-option">
		<div class="info">
			<div class="label">
				{{ data.flag }}
				{{ data.label }}
			</div>
			<div class="code">({{ data.code }})</div>
		</div>
	</div>
</template>

<style scoped>
.list {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.empty {
	color: var(--wx-color-font-disabled);
}
.custom-option {
	display: flex;
	flex-direction: row;
	width: 100%;
	gap: 4px;
}
.info {
	display: flex;
	flex-direction: column;
	gap: 4px;
}
.code {
	font-size: 12px;
	font-style: italic;
	color: var(--wx-color-font-disabled);
}
</style>
