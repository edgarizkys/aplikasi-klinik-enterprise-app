const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');

const app = express();
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

app.use(cors());
app.use(express.json());

const handleError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: 'Database error' });
};

app.get('/api/:entity', async (req, res) => {
  const { entity } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await db.execute({
      sql: `SELECT * FROM ?? LIMIT ? OFFSET ?`,
      args: [entity, parseInt(limit), parseInt(offset)]
    });
    res.json(result.rows);
  } catch (err) {
    handleError(res, err);
  }
});

app.post('/api/:entity', async (req, res) => {
  const { entity } = req.params;
  const data = req.body;
  const keys = Object.keys(data);
  const values = Object.values(data);
  
  try {
    await db.execute({
      sql: `INSERT INTO ?? (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
      args: [entity, ...values]
    });
    res.status(201).json({ message: 'Success' });
  } catch (err) {
    handleError(res, err);
  }
});

app.put('/api/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  const data = req.body;
  const setClause = Object.keys(data).map(k => `${k} = ?`).join(', ');
  
  try {
    await db.execute({
      sql: `UPDATE ?? SET ${setClause} WHERE ${Object.keys(data)[0].replace(/\d+/, '')}_id = ?`,
      args: [entity, ...Object.values(data), id]
    });
    res.json({ message: 'Updated' });
  } catch (err) {
    handleError(res, err);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));