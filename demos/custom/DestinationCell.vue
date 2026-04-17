<script setup>
import { computed } from "vue";

const props = defineProps({
	row: {},
	column: {},
});

const data = computed(() => {
	const ids = props.row[props.column.id];
	const options = props.column.options;
	if (!Array.isArray(ids) || !options) return [];
	return ids.map(id => options.find(o => o.id == id)).filter(Boolean);
});

const countriesCount = computed(() => data.value.length);
</script>

<template>
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
		<template v-else>
			<span class="empty">not selected</span>
		</template>
	</span>
</template>

<style scoped>
.empty {
	color: var(--wx-color-font-disabled);
}
</style>
