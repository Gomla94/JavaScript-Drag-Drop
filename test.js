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
  itemsArray = [backlogListArray, completeListArray, progressListArray, onHoldListArray];
  const namesArray = ['backlog', 'complete', 'progress', 'onHold'];

  namesArray.forEach((name, index) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(itemsArray[index]));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.setAttribute('draggable', true);
  listEl.setAttribute('ondragstart', 'drag(event)');
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
  backlogListArray.forEach((item, index) => {
    createItemEl(backlogList, 0, item, index);
  });

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((item, index) => {
    createItemEl(progressList, 0, item, index);
  });
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((item, index) => {
    createItemEl(completeList, 0, item, index);
  });
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((item, index) => {
    createItemEl(onHoldList, 0, item, index);
  });
  // Run getSavedColumns only once, Update Local Storage
  updateSavedColumns();

}

function drag(event) {
  draggedItem = event.target;
}

function allowDrag(event) {
  event.preventDefault();
}

function dragEnter(element) {
  currentColumn = element;
  currentColumn.classList.add('over');
}

function drop(event) {
  event.preventDefault();
  listColumns.forEach((item) => {
    item.classList.remove('over');
  });
  currentColumn.appendChild(draggedItem);
  updatedOnLoad = true;
  rebuildArrays();
}


//rebuild arrays
function rebuildArrays() {
  //backlog array
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }

  //complete array
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }

  //progress array
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }

  //on hold array
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  updateDOM();
}

updateDOM();