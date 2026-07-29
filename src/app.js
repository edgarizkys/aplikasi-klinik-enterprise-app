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

const handleError = (res, err) => res.status(500).json({ error: err.message });

app.get('/api/:entity', async (req, res) => {
  const { entity } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await db.execute({
      sql: `SELECT * FROM ${entity} LIMIT ? OFFSET ?`,
      args: [Number(limit), Number(offset)]
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
      sql: `INSERT INTO ${entity} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`,
      args: values
    });
    res.status(201).json({ message: 'Success' });
  } catch (err) {
    handleError(res, err);
  }
});

app.put('/api/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  const data = req.body;
  const sets = Object.keys(data).map(k => `${k} = ?`).join(', ');
  
  try {
    await db.execute({
      sql: `UPDATE ${entity} SET ${sets} WHERE id = ?`,
      args: [...Object.values(data), id]
    });
    res.json({ message: 'Updated' });
  } catch (err) {
    handleError(res, err);
  }
});

app.delete('/api/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  try {
    await db.execute({
      sql: `DELETE FROM ${entity} WHERE id = ?`,
      args: [id]
    });
    res.json({ message: 'Deleted' });
  } catch (err) {
    handleError(res, err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));