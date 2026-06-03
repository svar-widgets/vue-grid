<script setup>
const props = defineProps({
	row: {},
});
</script>

<template>
	<div class="container">
		<div class="avatar">
			<div class="user-avatar">
				<img
					v-if="props.row.avatar"
					class="user-photo"
					alt=""
					:src="props.row.avatar"
				/>
			</div>
		</div>
		<div class="info">
			<div class="name">{{ props.row.lastName }}</div>
			<div class="mail">{{ props.row.email || "" }}</div>
		</div>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	align-items: center;
	height: 56px;
	padding: 0 12px;
}

.avatar {
	width: 70px;
}

.name {
	flex: 1;
}

.mail {
	flex: 1;
}

.user-avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: #dfe2e6;
	text-align: center;
}

.user-photo {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background-color: #dfe2e6;
}
</style>
