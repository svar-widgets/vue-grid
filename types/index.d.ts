import type { DefineComponent } from "vue";

import type {
	IColumn,
	IRow,
	IApi,
	ISizeConfig,
	TMethodsConfig,
	IConfig,
	TEditorType,
	IColumnEditor,
	IHeaderCell,
} from "@svar-ui/grid-store";

export * from "@svar-ui/grid-store";

export interface IColumnEditorConfig extends IColumnEditor {
	config?: IColumnEditor["config"] & {
		cell?: DefineComponent<{
			data: any;
			onaction: (ev: {
				action?: any;
				data?: { [key: string]: any };
			}) => void;
		}>;
	};
}

export type TEditorHandlerConfig = (
	row?: IRow,
	column?: IColumn
) => TEditorType | IColumnEditorConfig | null;

export type IInnerApi = Pick<
	IApi,
	"exec" | "getState" | "getReactiveState" | "getRow"
>;

export interface ICellProps {
	api: IInnerApi;
	row: IRow;
	column: IColumn;
	onaction: (ev: { action?: any; data?: { [key: string]: any } }) => void;
}

export interface IHeaderCellProps {
	api: IInnerApi;
	row: number;
	column: IColumn;
	cell: Omit<IHeaderCell, "cell">;
	onaction: (ev: { action?: any; data?: { [key: string]: any } }) => void;
}

export interface IHeaderCellConfig extends IHeaderCell {
	cell?: DefineComponent<IHeaderCellProps>;
}

export type TColumnHeaderConfig =
	| string
	| IHeaderCellConfig
	| (string | IHeaderCellConfig)[];

export interface IColumnConfig
	extends Omit<
		IColumn,
		"left" | "right" | "fixed" | "optionsMap" | "header" | "footer"
	> {
	cell?: DefineComponent<ICellProps>;
	editor?: TEditorType | IColumnEditorConfig | TEditorHandlerConfig;
	header?: TColumnHeaderConfig;
	footer?: TColumnHeaderConfig;
}

export declare const Grid: DefineComponent<{
	rowStyle?: (row: any) => string;
	columnStyle?: (column: IColumn) => string;
	cellStyle?: (row: any, column: IColumn) => string;
	multiselect?: boolean;
	autoConfig?: boolean | IColumnConfig;
	header?: boolean;
	footer?: boolean;
	reorder?: boolean;
	autoRowHeight?: boolean;
	responsive?: {
		[key: string]: {
			sizes?: ISizeConfig;
			columns?: IColumnConfig[];
		};
	};
	init?: (api: IApi) => void;
	overlay?: string | DefineComponent;
	columns: IColumnConfig[];
	hotkeys?:
		| false
		| { [key: string]: ((e?: KeyboardEvent) => void) | boolean };
	data?: IRow[];
	sortMarks?: Record<string, { order: "asc" | "desc"; index?: number }>;
	selectedRows?: (string | number)[];
	dynamic?: { rowCount?: number; columnCount?: number };
	sizes?: ISizeConfig;
	split?: { left?: number };
	tree?: boolean;
	undo?: boolean;
	select?: boolean;
	filterValues?: { [key: string]: any };
}>;

export declare function registerInlineEditor(
	type: string,
	component: DefineComponent
): void;

export declare const HeaderMenu: DefineComponent<{
	columns?: { [key: string]: boolean };
	api?: IApi;
}>;

export declare const ContextMenu: DefineComponent<{
	api?: IApi;
	[key: string]: any;
}>;

export declare const Toolbar: DefineComponent<{
	api?: IApi;
	[key: string]: any;
}>;

export declare const Tooltip: DefineComponent<{
	content?: DefineComponent<{
		data: {
			row: IRow;
			column: IColumn;
		};
	}>;
	api?: IApi;
	at?: string;
	overflow?: boolean;
	resolver?: (element: HTMLElement) => any;
	[key: string]: any;
}>;

export declare const Material: DefineComponent<{
	fonts?: boolean;
}>;

export declare const Willow: DefineComponent<{
	fonts?: boolean;
}>;

export declare const WillowDark: DefineComponent<{
	fonts?: boolean;
}>;
