/*
File Name:      index.html
Student Name:   Ajani Scarlett
Student ID:     2302995
Assignment:     Intro_to_JS-Interactive_Task_Manager
Due Date:       7/11/2026
*/

'use strict'; //enforce that variables are declared before use.

// this initializes the STORAGE_KEY to my_tasks_key
//this is so if I need to change the key, I have to only change in one place 
const STORAGE_KEY = 'my_tasks_key';

// allows me to create a variable where the value can be manipulated later on
let tasks = [];

//this allows the JS to communicate seamlessly with the HTML created variables 
const form        = document.getElementById('task-form');
const titleInput  = document.getElementById('task-title');
const prioritySel = document.getElementById('task-priority');
const taskList    = document.getElementById('task-list');
const statsEl     = document.getElementById('task-stats');

/* ---------- STORAGE ---------- */

// essentially this function loads tasks from the local storage and ensures that the data is valid beofre returning it 
function loadTasks() {

  // trys to execute the code inside this function, if an error occurs it jumps to the catch block
  try {

    // JSON.parse converts the stored string into an actual JS object 
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));

    //this line essencially just checks to see if tasks is actually being stored as an array 
    // the filter creates a new array containing items that passed the previous test, and if it failed it would return a empty array 
    // the parsed.filter is a fail safe test basically ensuring that an error does not occur in the event 't' is null, checking that both the 'id' and 'title' exist
    return Array.isArray(parsed) ? parsed.filter(t => t?.id && t?.title) : [];

    //catches the error and returns and empty array
  } catch { return []; }
}

function saveTasks() {

  // this portion attempts to convert the 'tasks' array into text and save it in local storage by using storage key stored in 'STORAGE_KEY'
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }

  // this catches an error that happened inside the block, and is received by the variable xyz
  // console.warn prints the warning message to the developer console, and the last xyz call, displays the full error detail for debugging
  catch (xyz) { console.warn('Could not save tasks:', xyz); } 
  
}

/* ---------- RENDER ---------- */
function renderTasks() {

  // this removes any thing that was inside the tasklist previously, getting it ready for another input
  taskList.innerHTML = '';
// if there are no tasks then show the empty state message 
  if (!tasks.length) {
    taskList.innerHTML = '<p class="empty-state">No tasks yet. Add one above!</p>';
    //if there is a task 
  } else {
    // create a temporary container essencially and build the different tasks in one at a time and them insert it all at once 
    const frag = document.createDocumentFragment();
    //this line goes through each created task one by one, and adds the to the fragment or the temporary container 
    tasks.forEach(t => frag.appendChild(createTaskElement(t)));
    // after it has finish looping through the container it inserts the entire fragment to the page, for the user to see the full container all at once 
    taskList.appendChild(frag);
  }
  // this essencially updates the task list with the other tasks 
  updateStats();
}

// this function creates the tasks elements for the task block 
function createTaskElement(task) {
  const item = document.createElement('div');
  item.className = `task-item ${task.priority}${task.completed ? ' completed' : ''}`;
  item.dataset.id = task.id;

  const titleSpan = document.createElement('span');
  const badge = document.createElement('span');
  badge.className = `priority-badge ${task.priority}`;
  badge.textContent = task.priority;
  titleSpan.append(badge, document.createTextNode(task.title));

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'toggle-btn';
  toggleBtn.dataset.action = 'toggle';
  toggleBtn.textContent = task.completed ? 'Undo' : 'Done';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-btn';
  deleteBtn.dataset.action = 'delete';
  deleteBtn.textContent = 'Delete';

  actions.append(toggleBtn, deleteBtn);
  item.append(titleSpan, actions);
  return item;
}

// This function updates the text that shows task progress
function updateStats() {
  //this line gets the total number of tasks 
  const total = tasks.length;
  // this line counts how many of those task are actually completed
  const done = tasks.filter(t => t.completed).length;
  // if there are tasks present, then show the stats of how many are completed, otherwise show blank 
  // the 'task${total === 1 ? '' : 's'} essencially means if there are more than one task add a 's' to make task plural 
  statsEl.textContent = total ? `${done} of ${total} task${total === 1 ? '' : 's'} completed` : '';
}

/* ---------- ACTIONS ---------- */

function handleAddTask(event) {
  // this line prevents the browser from doing normal task such as sending the data to some storage or refreshing the page
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) { titleInput.focus(); return; }

  tasks.push({
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    priority: prioritySel.value,
    completed: false,
  });

  saveTasks();
  renderTasks();
  form.reset();
  prioritySel.value = 'medium';
  titleInput.focus();
}

// this function handle the clicks on the complete and delete button 
function handleListClick(event) {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;
  const idx = tasks.findIndex(t => t.id === btn.closest('.task-item').dataset.id);
  if (idx === -1) return;

  if (btn.dataset.action === 'toggle') tasks[idx].completed = !tasks[idx].completed;
  else if (btn.dataset.action === 'delete') tasks.splice(idx, 1);
  else return;

  saveTasks();
  renderTasks();
}

/* ---------- INIT ---------- */
//whenever the user clicks Add Task or hit the enter key it would trigger the event function
tasks = loadTasks();
renderTasks();
form.addEventListener('submit', handleAddTask);
taskList.addEventListener('click', handleListClick);