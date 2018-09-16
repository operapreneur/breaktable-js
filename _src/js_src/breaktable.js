// Basic Table rules
// 1. Scope is only added to <th> elements

// data-breaktables="popup|integer"
// data-btcolumns="integer"
// data-btclass="broken-table|string"
// data-btidentifier="bt-[index]|inherit|string"
// data-btid="integer"

const breakTableContainers = document.querySelectorAll('.breaktableJS');
const lengthBreakTables = breakTableContainers.length;

// Handler when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function(){

  // Search doc for breaktable containers
  if (breakTableContainers) { getBreakTableContainers(); }

});

// Iterate over all breaktables
const getBreakTableContainers = () => {
  for (let i = 0; i < lengthBreakTables; i++) {
    let table = breakTableContainers[i].getElementsByTagName("table");
    let l = table.length;

    if (l === 1){

      if (table[0].dataset.breaktables) {
        if (table[0].dataset.btcolumns) {
          buildBreakTables(i, table[0]);
        } else {
          console.log("ERROR: data-btcolumns attribute must be set on the table");
        }
      } else {
        console.log("ERROR: data-breaktable attribute must be set on the table");
      }

    } else {
      console.log("ERROR: breakTableContainers must contain one table only");
    }
  }
}

// Return new tables
const buildBreakTables = (iBTcontainer, table) => {
  // console.dir(table);

  // SET table class name
  let btClass = setBTclassName(table)

  // GET all existing class names
  let classArray = getClassNames(table, btClass)

  // SET table ID name
  let btID = setBTidName(iBTcontainer, table)

  // SET total tables +1 for readable id names
  let breakcolumns = JSON.parse("[" + table.dataset.breaktables + "]");
  let newTables = parseInt(breakcolumns.length) + 1;

  // GET total number of columns
  let totalColumns = parseInt(table.dataset.btcolumns);

  // CREATE new tables
  for (let i = 1; i < newTables; i++) {
    let t = document.createElement('table');
    t.classList.add(...classArray)
    t.id = btID + '-' + [i];

    let tableNode = t;

    // args rule: parent > interval > child
    addBTchildren(totalColumns, breakcolumns, table, i, tableNode);

    // console.log(tableNode);
    // console.dir(tableNode);
    table.closest('.breaktableJS').appendChild(tableNode);
  } // END for loop
}

// SET table class name: data-btclass="broken-table|string"
const setBTclassName = (table) => {
  let className = table.dataset.btclass;
  return (className) ? className : "broken-table";
}

const getClassNames = (table, btClass) => {
  let classList = table.className.split(' ');
  let classArray = [btClass];
  classArray.push(...classList);
  return classArray
}

// SET table ID: data-btidentifier="bt-[index]|inherit|string"
const setBTidName = (iBTcontainer, table) => {
  let id;
  if (table.dataset.btidentifier) {
    id = table.dataset.btidentifier;
  } else if (table.id) {
    id = table.id;
  } else {
    // if no ID use table index +1 for readable id names
    let newIndex = iBTcontainer + 1;
    id = 'bt' + '-' + newIndex;
  }
  return id;
}

// ADD table children
const addBTchildren = (totalColumns, breakcolumns, table, tableIndex, tableNode) => {
  let l = table.children.length;
  for (let i = 0; i < l; i++) {

    // TODO: do not allow <colgroup>

    let tagName = table.children[i].tagName;
    let child = document.createElement(tagName);

    tableNode.appendChild(child);

    addBTrows(totalColumns, breakcolumns, tableIndex, tableNode, i, table.children[i]);
  } // END for loop
}

// ADD table rows from child
const addBTrows = (totalColumns, breakcolumns, tableIndex, tableNode, childIndex, childNode) => {
  let rowIndex = 0; // Due to ignored rows and rowSpan(?) the number of rows will not always equal the row loop interval
  let rows = childNode.rows;
  let l = childNode.rows.length;
  for (let i = 0; i < l; i++) {

    // TODO: if .rowSpan

    // check if row has data-btid
    if (rows[i].dataset.btid) {
      let btid = getBTrowTrue(tableIndex, childNode, i);
      // ADD row if data-btid is EQUAL to tableIndex
      if (btid === true) {
        let row = addBTrow(tableNode, childNode, i);
        tableNode.children[childIndex].appendChild(row);
        getBTcells(totalColumns, breakcolumns, tableIndex, tableNode, childIndex, rowIndex, rows[i]);
        rowIndex ++;
      } else {
        continue;
      }
    } else {
      let row = addBTrow(tableNode, childNode, i);
      tableNode.children[childIndex].appendChild(row);
      getBTcells(totalColumns, breakcolumns, tableIndex, tableNode, childIndex, rowIndex, rows[i]);
      rowIndex ++;
    }
  } // END for loop
}

// RETURN rows equal to data-btid
const getBTrowTrue = (tableIndex, childNode, rowsIndex) => {
  let str = childNode.rows[rowsIndex].dataset.btid;
  let array = JSON.parse("[" + str + "]");
  if (array.includes(tableIndex)) {
    return true;
  }
}

// ADD table row
const addBTrow = (tableNode, child, index) => {
  let tagName = child.rows[index].tagName;
  let row = document.createElement(tagName);
  if (child.rows[index].className) {
    row.className = child.rows[index].className;
  }
  return row;
}

// GET table cells
const getBTcells = (totalColumns, breakcolumns, tableIndex, tableNode, childIndex, rowIndex, rowNode) => {
  let l = rowNode.children.length;
  let columnIndex = tableIndex - 1;
  columnIndex = breakcolumns[columnIndex]

  for (let i = 0; i < l; i++) {
    let cell = rowNode.children[i];

    let cellInterval = i+1;
    let cellIndex = cell.cellIndex + 1;
    let tagName = getBTcellTagName(cell);

    let cellVals = {};
    cellVals.appendCell = false;

    if (tagName === true ) { // if <th>
      let scope = getBTcellScope(cell);
      if (scope === 'col') {
        // cell = TH && scope=col
        cellVals = getBTcellColSpan(totalColumns, columnIndex, cellInterval, cellIndex, cell);
      } else {
        // cell = TH && scope=row
        cellVals = getBTcellRowSpan(totalColumns, cell);
        cellVals.appendCell = true;
      }
    } else {
      // cell = TD
      cellVals = getBTcellColSpan(totalColumns, columnIndex, cellInterval, cellIndex, cell);
    }

    if (cellVals.appendCell === true) {
      let element = addBTcell(cell, cellVals.cellColSpan)
      tableNode.children[childIndex].rows[rowIndex].appendChild(element);
    }
  }

}

const getBTcellTagName = cell => (cell.tagName == 'TH') ? true : false;
const getBTcellScope = cell => cell.scope;

const getBTcellRowSpan = (totalColumns, cell) => {
  let colSpan = cell.colSpan;
  let cellColSpan = 1;

  if (totalColumns == colSpan) {
    cellColSpan = colSpan - 1;
  }

  return {cellColSpan};
}

const getBTcellColSpan = (totalColumns, columnIndex, cellInterval, cellIndex, cell) => {
  let colSpan = cell.colSpan;
  let cellColSpan = 1;
  let appendCell = false;

  if (colSpan >= 2 ) {
    let spanLength = colSpan - 1;
    let spanMax = cellIndex + spanLength

    if ((cellIndex == cellInterval) && (columnIndex == cellInterval)) {
      appendCell = true;
    } else if ((spanMax >= columnIndex) && (columnIndex > cellInterval)) {
      appendCell = true;
    } else {
      appendCell = false;
    }
  } else {
    if (columnIndex == cellInterval) {
      appendCell = true;
    }
  }

  return {appendCell, cellColSpan};
}

// ADD table cell
const addBTcell = (cell, cellColSpan) => {
  let tagName = cell.tagName;
  let classList = cell.className;
  let element = document.createElement(tagName);
  element.className = classList;
  element.colSpan = cellColSpan;
  element.innerHTML = cell.innerHTML;

  return element;
}
