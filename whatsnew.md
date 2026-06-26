## 2.7.1

### Fixes

- Header colspans are clipped when start column is hidden
- Grid cell focus is lost during key navigation
- Resize marker goes above the fixed column
- Horizontal scroll is corrupt if at least one column is flexible
- Vertical header cell is missing when collapsing a pinned column

## 2.7.0

### New features

- Multi-select filter for Grid columns
- Scroll-to action to force and listen to scroll movements

### Updates

- Extra Tooltip settings: arrow, delay, at, overlow, etc
- Ability to set input type for "text" editor

### Fixes

- Closing an inline editor by clicking on another cell doesn't focus the cell clicked
- Incorrect type for header cells
- Columns flicker when a new row is added in a Grid with flexgrow
- Incorrect type for `filterValues`
- Multiselect editor value is not applied

### Breaking changes

- Parameters of Tooltip content component changed from `{ row, column }` to `{ data: row, column } `

## 2.6.0

### Initial features

Provides all the same functionality as Svelte Grid 2.6.0
