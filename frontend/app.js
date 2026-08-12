const API_URL = `http://${window.location.hostname}:3001/api/tasks`;

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    const span = document.createElement('span');
    span.textContent = task.title;
    span.addEventListener('click', () => toggleTask(task));

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

async function toggleTask(task) {
  await fetch(`${API_URL}/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !task.done })
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadTasks();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  input.value = '';
  loadTasks();
});

loadTasks();
