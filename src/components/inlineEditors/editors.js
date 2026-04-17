import Text from "./Text.vue";
import Combo from "./Combo.vue";
import Datepicker from "./Datepicker.vue";
import Richselect from "./Richselect.vue";
import Multiselect from "./MultiSelect.vue";

export const editors = {
	text: Text,
	combo: Combo,
	datepicker: Datepicker,
	richselect: Richselect,
	multiselect: Multiselect,
};

export function registerInlineEditor(type, component) {
	editors[type] = component;
}
