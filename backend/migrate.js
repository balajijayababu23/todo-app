require('dotenv').config();
const pool = require('./db');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

async function migrate() {
  try {
    await pool.query(createTableQuery);
    console.log('Migration successful: tasks table is ready.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

migrate();