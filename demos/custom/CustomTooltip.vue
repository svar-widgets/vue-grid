<script setup>
import { computed } from "vue";

const props = defineProps({
	data: {},
});

const stars = computed(() => {
	const res = [];
	const max = 5;
	const n = Math.round((props.data.stars / 10000) * max);
	for (let i = 0; i < max; i++) {
		if (i < n) res.push({ filled: true });
		else res.push({});
	}

	return res;
});
</script>

<template>
	<div class="data">
		<div class="line">
			<b>Name:</b> {{ data.firstName }} {{ data.lastName }}
		</div>
		<div class="line"><b>City:</b> {{ data.city || "Unknown" }}</div>
		<div class="line"><b>Email:</b> {{ data.email }}</div>
		<div class="line">
			<b>Address:</b> {{ data.street }}, {{ data.zipCode }}
		</div>
		<div class="line stars">
			<i
				v-for="(star, index) in stars"
				:key="index"
				class="wxi-cat"
				:class="{ filled: star.filled }"
			></i>
			({{ data.stars }})
		</div>
		<div class="line"><b>Followers:</b> {{ data.followers }}</div>
	</div>
</template>

<style scoped>
.data {
	padding: 10px;
	white-space: nowrap;
}

.line {
	padding-top: 4px;
}

.line.stars {
	display: flex;
	padding-top: 8px;
}

.wxi-cat {
	font-size: 20px;
}

.wxi-cat.filled {
	color: gold;
}
</style>
