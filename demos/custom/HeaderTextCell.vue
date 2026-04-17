<script setup>
import { Button } from "@svar-ui/vue-core";
</script>

<template>
	<div class="header-content">
		<Button type="secondary" icon="wxi-alert" />
		<span>Custom header content</span>
	</div>
</template>

<style scoped>
.header-content {
	display: flex;
	align-items: center;
}

.header-content span {
	margin-left: 10px;
}

.header-content i {
	display: inline-flex;
	font-size: 20px;
}
</style>
