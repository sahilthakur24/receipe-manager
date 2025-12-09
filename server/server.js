import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.resolve('./server/db.json');

app.use(cors());
app.use(express.json());

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { recipes: [] };
  }
}

async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

app.get('/api/recipes', async (req, res) => {
  const db = await readDb();
  res.json(db.recipes || []);
});

app.post('/api/recipes', async (req, res) => {
  const { title, description, ingredients = [], steps = [] } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Missing title or description' });

  const db = await readDb();
  const id = Date.now().toString();
  const recipe = {
    id,
    title,
    description,
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    steps: Array.isArray(steps) ? steps : []
  };

  db.recipes = db.recipes || [];
  db.recipes.push(recipe);
  await writeDb(db);

  res.status(201).json(recipe);
});

app.delete('/api/recipes/:id', async (req, res) => {
  const id = req.params.id;
  const db = await readDb();
  const before = db.recipes.length;
  db.recipes = (db.recipes || []).filter(r => r.id !== id);
  if (db.recipes.length === before) return res.status(404).json({ error: 'Not found' });
  await writeDb(db);
  res.status(204).end();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});
