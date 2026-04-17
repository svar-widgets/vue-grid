<script setup>
defineOptions({ name: "GridEditorEditor" });

import {
	Field,
	Text,
	RichSelect,
	MultiCombo,
	DatePicker,
	Area,
	Checkbox,
	Switch,
} from "@svar-ui/vue-core";
import { subscribe } from "@svar-ui/lib-vue";

const props = defineProps({
	editors: {},
	data: { default: null },
});

const dataRef = subscribe(props.data);

function updateField(id, value) {
	props.data.update(v => {
		v[id] = value;
		return v;
	});
}
</script>

<template>
	<template v-if="dataRef">
		<template v-for="editor in editors" :key="editor.id">
			<Field v-if="editor.type === 'combo'" :label="editor.label">
				<RichSelect
					:options="editor.options || []"
					:value="dataRef[editor.id]"
					@update:value="v => updateField(editor.id, v)"
				/>
			</Field>
			<Field
				v-else-if="editor.type === 'multicombo'"
				:label="editor.label"
			>
				<MultiCombo
					text-field="name"
					:checkboxes="false"
					:options="editor.options || []"
					:value="dataRef[editor.id]"
					@update:value="v => updateField(editor.id, v)"
				/>
			</Field>
			<Field
				v-else-if="editor.type === 'datepicker'"
				:label="editor.label"
			>
				<DatePicker
					:value="dataRef[editor.id]"
					@update:value="v => updateField(editor.id, v)"
				/>
			</Field>
			<Field
				v-else-if="editor.type === 'textarea'"
				:label="editor.label"
			>
				<Area
					:value="dataRef[editor.id]"
					@update:value="v => updateField(editor.id, v)"
				/>
			</Field>
			<Field
				v-else-if="editor.type === 'switch'"
				:label="editor.label"
			>
				<Switch
					:value="dataRef[editor.id]"
					@update:value="v => updateField(editor.id, v)"
				/>
			</Field>
			<Field
				v-else-if="editor.type === 'checkbox'"
				:label="editor.label"
			>
				<Checkbox
					:value="dataRef[editor.id]"
					@update:value="v => updateField(editor.id, v)"
				/>
			</Field>
			<Field v-else :label="editor.label">
				<Text
					:value="dataRef[editor.id]"
					@update:value="v => updateField(editor.id, v)"
				/>
			</Field>
		</template>
	</template>
</template>
