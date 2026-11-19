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
	TEditorConfig,
} from "@svar-ui/grid-store";
import type { TID } from "@svar-ui/lib-state";

export * from "@svar-ui/grid-store";

// the action that custom cells and editors send up through onaction
export interface ICellAction {
	action?: any;
	data?: { [key: string]: any };
}

export interface IColumnEditorConfig extends IColumnEditor {
	config?: IColumnEditor["config"] & {
		cell?: DefineComponent<{
			data: any;
			onaction: (ev: ICellAction) => void;
		}>;
	};
}

// returns the editor for the cell, or nothing when the cell is not editable
export type TEditorHandlerConfig = (
	row?: IRow,
	column?: IColumn
) => TEditorType | IColumnEditorConfig | null | undefined;

// API shared with inner components and custom cells through the "grid-store" context
export type IInnerApi = Pick<
	IApi,
	"exec" | "getState" | "getReactiveState" | "getRow"
>;

// the columns that reach cells always have an id
type TCellColumn = IColumn & { id: TID };

export interface ICellProps {
	api: IInnerApi;
	row: IRow;
	column: TCellColumn;
	onaction: (ev: ICellAction) => void;
}

export interface IHeaderCellProps {
	api: IInnerApi;
	row: number;
	column: TCellColumn;
	cell: Omit<IHeaderCell, "cell">;
	onaction: (ev: ICellAction) => void;
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

// props the grid passes to inline editors, the built-in ones and registered ones
export interface IInlineEditorProps {
	editor: TEditorConfig;
	onsave: (ignoreFocus?: boolean) => void;
	// any truthy value, the click event included, keeps the focus off the cell
	oncancel: (ignoreFocus?: boolean | Event) => void;
	onapply: (value: any) => void;
	onaction: (ev: ICellAction) => void;
}

/* get component events from store actions */
type RemoveHyphen<S extends string> = S extends `${infer Head}-${infer Tail}`
	? `${Head}${RemoveHyphen<Tail>}`
	: S;

type EventName<K extends string> = `on${RemoveHyphen<K>}`;

export type GridActions<T extends Record<string, any> = TMethodsConfig> = {
	[K in keyof T as EventName<K & string>]?: (ev: T[K]) => void;
} & {
	[key: `on${string}`]: ((ev?: any) => void) | undefined;
};

export declare const Grid: DefineComponent<{
	rowStyle?: (row: any) => string;
	columnStyle?: (column: IColumn) => string;
	cellStyle?: (row: any, column: IColumn) => string;
	multiselect?: boolean;
	autoConfig?: boolean | IColumnConfig;
	header?: boolean;
	footer?: boolean;
	reorder?: boolean;
	draggableRows?: boolean | ((row: IRow) => boolean);
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
	resizeRow?: boolean;
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
} & GridActions>;

export declare function registerInlineEditor(
	type: string,
	component: DefineComponent<IInlineEditorProps>
): void;

export declare const HeaderMenu: DefineComponent<{
	columns?: { [key: string]: boolean };
	api?: IApi;
}>;

export declare const ColumnMenu: DefineComponent<{
	api?: IApi;
	columns?: { [key: string]: boolean } | null;
	[key: string]: any;
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
