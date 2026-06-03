<script setup>
import { computed } from "vue";
import { Avatar } from "@svar-ui/vue-core";

const props = defineProps({
	row: {},
	data: {},
	column: {},
});

const userData = computed(() => {
	if (props.data) return props.data;
	const users = props.column.options;
	const options = props.row["assigned"]?.map(id =>
		users.find(user => user.id === id)
	);
	if (options?.length === 1) {
		return options[0];
	}
	return options;
});

const names = computed(() => {
	if (Array.isArray(userData.value) && userData.value.length) {
		return userData.value.map(user => user.name).join(", ");
	}
	return "";
});

const userKey = computed(() => {
	const d = userData.value;
	if (Array.isArray(d)) return d.map(user => user?.id).join(",");
	return d?.id ?? "";
});
</script>

<template>
	<div :key="userKey" class="container">
		<template v-if="Array.isArray(userData)">
			<template v-if="userData.length < 3">{{ names }}</template>
			<Avatar v-else :value="userData" :size="22" />
		</template>
		<template v-else>
			<Avatar :value="userData" :size="28" />
			<div>{{ userData?.name ?? "" }}</div>
		</template>
	</div>
</template>

<style scoped>
.container {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 4px;
}
</style>
