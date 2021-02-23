const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;
let draggedItem;
let currentColumn;
let dragging = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let itemsArray = [];

// Drag Functionality


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }

}

// Set localStorage Arrays
function updateSavedColumns() {
  itemsArray = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];

  arrayNames.forEach((name, index) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(itemsArray[index]));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.setAttribute('draggable', true);
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.setAttribute('contenteditable', true);
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${column}, ${index})`);
  columnEl.append(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray = filterArray(backlogListArray);
  backlogListArray.forEach((item, index) => {
    createItemEl(backlogList, 0, item, index);
  });

  // Progress Column
  progressList.textContent = '';
  progressListArray = filterArray(progressListArray);
  progressListArray.forEach((item, index) => {
    createItemEl(progressList, 1, item, index);
  });

  // Complete Column
  completeList.textContent = '';
  completeListArray = filterArray(completeListArray);
  completeListArray.forEach((item, index) => {
    createItemEl(completeList, 2, item, index);
  });

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray = filterArray(onHoldListArray);
  onHoldListArray.forEach((item, index) => {
    createItemEl(onHoldList, 3, item, index);
  });

  // Run getSavedColumns only once, Update Local Storage
  updateSavedColumns();

}

//rebuild arrays after the drop event, then update the dom
function rebuildArrays() {
  backlogListArray = [];
  progressListArray = [];
  completeListArray = [];
  onHoldListArray = [];

  backlogListArray = Array.from(backlogList.children).map(item => item.textContent);
  progressListArray = Array.from(progressList.children).map(item => item.textContent);
  completeListArray = Array.from(completeList.children).map(item => item.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(item => item.textContent);

  updatedOnLoad = true;
  updateDOM();
}

//on drag
function drag(event) {
  draggedItem = event.target;
  dragging = true;
}

//when the dragged column enter another list
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = listColumns[column];
}

//on drop
function drop(event) {
  event.preventDefault();
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  currentColumn.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

//on drag over
function allowDrop(event) {
  event.preventDefault();
}

function showInput(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

//add new item, then update DOM
function addNewItem(column) {
  let newItemText = addItems[column].textContent;
  if (newItemText == '') {
    return;
  }
  const parentArray = itemsArray[column];
  parentArray.push(newItemText);
  updatedOnLoad = true;
  addItems[column].textContent = '';
  updateDOM();
}

//update item, delete it if null, update the arrays
function updateItem(column, id) {
  let selectedArray = itemsArray[column];
  const parentColumn = listColumns[column];
  const selectedItem = parentColumn.children[id];
  //update only if the dragging event has stopped
  if (!dragging) {
    if (selectedItem.textContent == '') {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedItem.textContent;
      updatedOnLoad = true;
      updateDOM();
    }
  }
}

//filter array, so any empty items in it will be removed
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

function hideInput(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addNewItem(column);
}


updateDOM();
// getSavedColumns();
// updateSavedColumns();