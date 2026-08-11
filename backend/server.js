// Simple Todo API backend
// Stores tasks in memory for now (Week 3 will move this to PostgreSQL)

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory "database" — just an array for now
let tasks = [
  { id: 1, title: 'Learn Docker', done: false },
  { id: 2, title: 'Deploy to AWS', done: false }
];
let nextId = 3;

// GET /api/tasks -> list all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks -> create a new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = { id: nextId++, title: title.trim(), done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id -> toggle done / update a task
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (typeof req.body.done === 'boolean') task.done = req.body.done;
  if (typeof req.body.title === 'string') task.title = req.body.title;
  res.json(task);
});

// DELETE /api/tasks/:id -> remove a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === before) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).send();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Todo backend running on http://localhost:${PORT}`);
});
