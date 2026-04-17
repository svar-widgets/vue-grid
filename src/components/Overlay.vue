<script setup>
defineOptions({ name: "GridOverlay" });

import { inject } from 'vue';

const props = defineProps({
	overlay: {},
});

const api = inject("grid-store");

</script>

<template>
	<div class="wx-overlay">
		<component
			v-if="typeof overlay === 'object'"
			:is="overlay"
			:onaction="({ action, data }) => api.exec(action, data)"
		/>
		<template v-else>{{ overlay }}</template>
	</div>
</template>

<style scoped>
.wx-overlay {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 5;
	background-color: var(--wx-background);
	padding: 14px 8px;
	text-align: center;
}
</style>
