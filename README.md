**Proof of Concept**

# BreakTable JS
Sometimes your table data is complex and doesn't fit on a mobile screen, so break the table.

There are a number of different approaches and techniques to responsive data tables (ex: [CSS-Tricks article](https://css-tricks.com/responsive-data-table-roundup/)), but in working with very complex and intricate designs I've thrown my hat in the game and came of with another alternative.

## TODO:
- do not allow `<colgroup>`
- add `rowspan` logic

## Basic Table rules
1. Scope is only added to <th> elements

## Library Attributes
data-breaktables="popup|integer"

data-btcolumns="integer"

data-btclass="broken-table|string"

data-btidentifier="bt-[index]|inherit|string"

data-btid="integer"
