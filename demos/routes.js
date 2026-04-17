import AutoConfigColumns from "./cases/AutoConfigColumns.vue";
import BasicInit from "./cases/BasicInit.vue";
import CollapsibleColumns from "./cases/CollapsibleColumns.vue";
import ColumnsToContent from "./cases/ColumnsToContent.vue";
import ContextMenu from "./cases/ContextMenu.vue";
import CustomCells from "./cases/CustomCells.vue";
import CustomContextMenu from "./cases/CustomContextMenu.vue";
import CustomEmbedingActions from "./cases/CustomEmbedingActions.vue";
import DynamicData from "./cases/DynamicData.vue";
import EventHandling from "./cases/EventHandling.vue";
import ExternalEditor from "./cases/ExternalEditor.vue";
import ExternalEditorComments from "./cases/ExternalEditorComments.vue";
import ExternalEditorTasklist from "./cases/ExternalEditorTasklist.vue";
import FillspaceColumns from "./cases/FillspaceColumns.vue";
import FilterBar from "./cases/FilterBar.vue";
import FilterBuilder from "./cases/FilterBuilder.vue";
import FilterQuery from "./cases/FilterQuery.vue";
import FilterSimpleFilterBuilder from "./cases/FilterSimpleFilterBuilder.vue";
import Filters from "./cases/Filters.vue";
import FiltersCustom from "./cases/FiltersCustom.vue";
import FiltersCustomHandler from "./cases/FiltersCustomHandler.vue";
import ExternalFilters from "./cases/ExternalFilters.vue";
import FixedColumns from "./cases/FixedColumns.vue";
import InlineEditors from "./cases/InlineEditors.vue";
import InlineEditorsCells from "./cases/InlineEditorsCells.vue";
import InlineEditorsHandler from "./cases/InlineEditorsHandler.vue";
import InlineEditorsDisabled from "./cases/InlineEditorsDisabled.vue";
import MultilineRows from "./cases/MultilineRows.vue";
import Overlay from "./cases/Overlay.vue";
import HotkeysCustom from "./cases/HotkeysCustom.vue";
import Paging from "./cases/Paging.vue";
import Resize from "./cases/Resize.vue";
import Reordering from "./cases/Reordering.vue";
import RestBackend from "./cases/RestBackend.vue";
import RowMultiSelection from "./cases/RowMultiSelection.vue";
import RowSelection from "./cases/RowSelection.vue";
import ResponsiveMode from "./cases/ResponsiveMode.vue";
import ScrollTable from "./cases/ScrollTable.vue";
import SelectionCheckboxes from "./cases/SelectionCheckboxes.vue";
import SizeToContainer from "./cases/SizeToContainer.vue";
import SizeToContent from "./cases/SizeToContent.vue";
import Sort from "./cases/Sort.vue";
import SortCustom from "./cases/SortCustom.vue";
import StaticData from "./cases/StaticData.vue";
import Styling from "./cases/Styling.vue";
import TableAPI from "./cases/TableAPI.vue";
import TableHeaderFooterSpans from "./cases/TableHeaderFooterSpans.vue";
import TableHeaderFooterVertical from "./cases/TableHeaderFooterVertical.vue";
import Tooltips from "./cases/Tooltips.vue";
import VisibilityColumns from "./cases/VisibilityColumns.vue";
import Localization from "./cases/Localization.vue";
import TreeTable from "./cases/TreeTable.vue";
import Print from "./cases/Print.vue";
import PrintWideGrid from "./cases/PrintWideGrid.vue";
import UndoRedo from "./cases/UndoRedo.vue";
import Toolbar from "./cases/Toolbar.vue";
import ToolbarCustom from "./cases/ToolbarCustom.vue";
import ExternalToolbar from "./cases/ExternalToolbar.vue";
import CustomRowHeight from "./cases/CustomRowHeight.vue";
import ExportCSV from "./cases/ExportCSV.vue";


export const links = [
	["/base/:skin", "Basic DataGrid", BasicInit, "BasicInit"],
	[
		"/auto-config/:skin",
		"Automatically generated columns",
		AutoConfigColumns,
		"AutoConfigColumns",
	],
	[
		"/spans/:skin",
		"Header and footer spans",
		TableHeaderFooterSpans,
		"TableHeaderFooterSpans",
	],
	[
		"/fillspace/:skin",
		"Flexible column widths",
		FillspaceColumns,
		"FillspaceColumns",
	],
	[
		"/columns-to-content/:skin",
		"Column widths to content",
		ColumnsToContent,
		"ColumnsToContent",
	],
	["/resize/:skin", "Resize columns", Resize, "Resize"],
	[
		"/collapsible-columns/:skin",
		"Collapse columns",
		CollapsibleColumns,
		"CollapsibleColumns",
	],
	[
		"/visibility/:skin",
		"Hide/show columns",
		VisibilityColumns,
		"VisibilityColumns",
	],
	["/fixed/:skin", "Fixed columns", FixedColumns, "FixedColumns"],
	[
		"/header-vertical/:skin",
		"Vertical text in header",
		TableHeaderFooterVertical,
		"TableHeaderFooterVertical",
	],

	[
		"/size-container/:skin",
		"Size to container",
		SizeToContainer,
		"SizeToContainer",
	],
	["/size-content/:skin", "Size to content", SizeToContent, "SizeToContent"],
	[
		"/responsive-mode/:skin",
		"Responsive mode",
		ResponsiveMode,
		"ResponsiveMode",
	],

	["/styling/:skin", "Styling", Styling, "Styling"],

	["/multiline-row/:skin", "Multi-line rows", MultilineRows, "MultilineRows"],
	["/selection/:skin", "Row selection", RowSelection, "RowSelection"],
	[
		"/multi-selection/:skin",
		"Multiple row selection",
		RowMultiSelection,
		"RowMultiSelection",
	],
	[
		"/check-selection/:skin",
		"Selection with checkboxes",
		SelectionCheckboxes,
		"SelectionCheckboxes",
	],

	["/custom/:skin", "Custom cells", CustomCells, "CustomCells"],
	[
		"/embedding-actions/:skin",
		"Custom cell actions",
		CustomEmbedingActions,
		"CustomEmbedingActions",
	],
	["/tooltips/:skin", "Tooltips for data cells", Tooltips, "Tooltips"],

	["/editors/:skin", "Cell editors", InlineEditors, "InlineEditors"],
	[
		"/editors-custom/:skin",
		"Custom cell editors",
		InlineEditorsCells,
		"InlineEditorsCells",
	],
	[
		"/editors-different/:skin",
		"Different editors in a column",
		InlineEditorsHandler,
		"InlineEditorsHandler",
	],
	[
		"/editors-disabled/:skin",
		"Disabled cell inline editors",
		InlineEditorsDisabled,
		"InlineEditorsDisabled",
	],
	["/editpanel/:skin", "Editor", ExternalEditor, "ExternalEditor"],
	[
		"/editpanel-comments/:skin",
		"Editor with Comments",
		ExternalEditorComments,
		"ExternalEditorComments",
	],
	[
		"/editpanel-tasklist/:skin",
		"Editor with Tasklist",
		ExternalEditorTasklist,
		"ExternalEditorTasklist",
	],

	["/reordering/:skin", "Reordering rows", Reordering, "Reordering"],
	["/sort/:skin", "Sort data", Sort, "Sort"],
	[
		"/sort-custom/:skin",
		"Custom data sorting",
		SortCustom,
		"Custom data sorting",
	],
	["/filters/:skin", "Filters", Filters, "Filters"],
	[
		"/filters-custom/:skin",
		"Filter settings",
		FiltersCustom,
		"FiltersCustom",
	],
	[
		"/filters-handler/:skin",
		"Filters with custom handler",
		FiltersCustomHandler,
		"FiltersCustomHandler",
	],
	[
		"/filters-external/:skin",
		"External filters",
		ExternalFilters,
		"ExternalFilters",
	],
	["/filterbar/:skin", "Filter data with FilterBar", FilterBar, "FilterBar"],
	[
		"/filterbuilder/:skin",
		"Filter data with FilterBuilder",
		FilterBuilder,
		"FilterBuilder",
	],
	[
		"/filterquery/:skin",
		"Filter data with FilterQuery",
		FilterQuery,
		"FilterQuery",
	],
	[
		"/filtered-data/:skin",
		"Filter data before parsing",
		FilterSimpleFilterBuilder,
		"FilterSimpleFilterBuilder",
	],
	["/pagination/:skin", "Pagination", Paging, "Paging"],

	["/context/:skin", "Context menu", ContextMenu, "ContextMenu"],
	[
		"/custom-context/:skin",
		"Custom context menu",
		CustomContextMenu,
		"CustomContextMenu",
	],

	["/overlay/:skin", "Overlay", Overlay, "Overlay"],
	["/hotkeys-custom/:skin", "Custom Hotkeys", HotkeysCustom, "HotkeysCustom"],
	["/bigdata/:skin", "Render big data", StaticData, "StaticData"],
	["/dynamic/:skin", "Dynamic loading", DynamicData, "DynamicData"],
	["/rest/:skin", "REST backend", RestBackend, "RestBackend"],

	["/treetable/:skin", "Tree structure", TreeTable, "TreeTable"],


	["/api/:skin", "API calls", TableAPI, "TableAPI"],
	["/events/:skin", "Event handling", EventHandling, "EventHandling"],
	["/scroll/:skin", "Scroll by API", ScrollTable, "ScrollTable"],
	["/print/:skin", "Print", Print, "Print"],
	["/print-wide/:skin", "Print wide grid", PrintWideGrid, "PrintWideGrid"],
	["/export-csv/:skin", "Export to CSV", ExportCSV, "ExportCSV"],
	["/locale/:skin", "Locales", Localization, "Localization"],
	["/undo-redo/:skin", "Undo/redo", UndoRedo, "UndoRedo"],
	["/toolbar/:skin", "Toolbar", Toolbar],
	["/toolbar-custom/:skin", "Toolbar: custom", ToolbarCustom],
	["/external-toolbar/:skin", "External Toolbar", ExternalToolbar],
	[
		"/custom-row-height/:skin",
		"Custom row heights",
		CustomRowHeight,
		"CustomRowHeight",
	],
];
