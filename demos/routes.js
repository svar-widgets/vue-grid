import AutoConfigColumns from "./cases/AutoConfigColumns.vue";
import BasicInit from "./cases/BasicInit.vue";
import CollapsibleColumns from "./cases/CollapsibleColumns.vue";
import ColumnsToContent from "./cases/ColumnsToContent.vue";
import ContextMenu from "./cases/ContextMenu.vue";
import CustomContextMenu from "./cases/CustomContextMenu.vue";
import CustomCells from "./cases/CustomCells.vue";
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
import CustomRowHeight from "./cases/CustomRowHeight.vue";
import ExportCSV from "./cases/ExportCSV.vue";


export const links = [
	["/base/:skin", "Basic DataGrid", BasicInit, "BasicInit"],
	["/bigdata/:skin", "Render big data", StaticData, "StaticData"],

	{ group: "Columns" },
	[
		"/auto-config/:skin",
		"Automatically generated columns",
		AutoConfigColumns,
		"AutoConfigColumns",
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
	["/fixed/:skin", "Pinned columns", FixedColumns, "FixedColumns"],
	["/resize/:skin", "Resize columns", Resize, "Resize"],
	[
		"/visibility/:skin",
		"Hide/show columns",
		VisibilityColumns,
		"VisibilityColumns",
	],
	[
		"/collapsible-columns/:skin",
		"Collapse columns",
		CollapsibleColumns,
		"CollapsibleColumns",
	],
	[
		"/spans/:skin",
		"Spans in header and footer",
		TableHeaderFooterSpans,
		"TableHeaderFooterSpans",
	],
	[
		"/header-vertical/:skin",
		"Vertical text in header",
		TableHeaderFooterVertical,
		"TableHeaderFooterVertical",
	],

	{ group: "Cells" },
	["/custom/:skin", "Custom cells", CustomCells, "CustomCells"],
	[
		"/embedding-actions/:skin",
		"Custom cell actions",
		CustomEmbedingActions,
		"CustomEmbedingActions",
	],
	["/tooltips/:skin", "Tooltips", Tooltips, "Tooltips"],
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
		"Disabled cell editors",
		InlineEditorsDisabled,
		"InlineEditorsDisabled",
	],

	{ group: "Rows" },
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
	[
		"/custom-row-height/:skin",
		"Custom row heights",
		CustomRowHeight,
		"CustomRowHeight",
	],
	[
		"/multiline-row/:skin",
		"Auto row heights",
		MultilineRows,
		"MultilineRows",
	],
	["/reordering/:skin", "Reordering rows", Reordering, "Reordering"],
	["/treetable/:skin", "Tree rows", TreeTable, "TreeTable"],

	{ group: "Data operations" },
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
	["/filterbar/:skin", "Integration with FilterBar", FilterBar, "FilterBar"],
	[
		"/filterbuilder/:skin",
		"Integration with FilterBuilder",
		FilterBuilder,
		"FilterBuilder",
	],
	[
		"/filterquery/:skin",
		"Integration with FilterQuery",
		FilterQuery,
		"FilterQuery",
	],
	["/sort/:skin", "Sort data", Sort, "Sort"],
	[
		"/sort-custom/:skin",
		"Sort data with custom functions",
		SortCustom,
		"Custom data sorting",
	],
	["/pagination/:skin", "Pagination", Paging, "Paging"],
	["/undo-redo/:skin", "Undo/redo", UndoRedo, "UndoRedo"],
	["/events/:skin", "Action handlers", EventHandling, "EventHandling"],

	{ group: "UI / Interactions" },
	["/toolbar/:skin", "Toolbar: built-in", Toolbar],
	["/toolbar-custom/:skin", "Toolbar: custom", ToolbarCustom],
	["/context/:skin", "Context menu: built-in", ContextMenu, "ContextMenu"],
	[
		"/custom-context/:skin",
		"Context menu: custom",
		CustomContextMenu,
		"CustomContextMenu",
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
	["/hotkeys-custom/:skin", "Custom hotkeys", HotkeysCustom, "HotkeysCustom"],
	["/scroll/:skin", "Scrolling", ScrollTable, "ScrollTable"],

	{ group: "Load & Save" },
	["/dynamic/:skin", "Dynamic loading", DynamicData, "DynamicData"],
	["/rest/:skin", "REST backend", RestBackend, "RestBackend"],
	["/export-csv/:skin", "Export to CSV", ExportCSV, "ExportCSV"],
	["/print/:skin", "Print", Print, "Print"],
	[
		"/print-wide/:skin",
		"Print: wide DataGrid",
		PrintWideGrid,
		"PrintWideGrid",
	],


	{ group: "Appearance" },
	["/styling/:skin", "Styling", Styling, "Styling"],
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
	["/overlay/:skin", "Overlay", Overlay, "Overlay"],
	["/locale/:skin", "Locales", Localization, "Localization"],
];
