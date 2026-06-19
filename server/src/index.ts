import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb, run, get, all } from './db.js';
import { authenticateToken } from './middleware/auth.js';
import type { AuthRequest } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_carbon_mirror_token_key_2026';

app.use(cors());
app.use(express.json());

// Initialize database
initDb()
  .then(() => console.log('Database initialized successfully.'))
  .catch((err) => console.error('Database initialization failed:', err));

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }

  try {
    const existingUser = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await run(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    const userId = result.lastID;
    const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: userId, name, email }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const user = await get<{ id: number; name: string; email: string; password_hash: string }>(
      'SELECT id, name, email, password_hash FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      res.status(400).json({ error: 'Invalid email or password.' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      res.status(400).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

app.get('/api/auth/profile', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Lifestyle Answers Endpoints
app.get('/api/lifestyle', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const answers = await get('SELECT * FROM lifestyle_answers WHERE user_id = ?', [userId]);
    if (!answers) {
      res.json(null);
      return;
    }
    // Convert SQLite 0/1 back to boolean
    const result = {
      ...answers,
      localFood: (answers as any).local_food === 1,
      greenEnergy: (answers as any).green_energy === 1,
      commuteStyle: (answers as any).commute_style,
      commuteDistance: (answers as any).commute_distance,
      dietStyle: (answers as any).diet_style,
      electricityBill: (answers as any).electricity_bill,
      acUsage: (answers as any).ac_usage,
      onlinePurchases: (answers as any).online_purchases,
      deliveryFrequency: (answers as any).delivery_frequency,
      digitalUsage: (answers as any).digital_usage,
      wasteGeneration: (answers as any).waste_generation,
      yearlyFlights: (answers as any).yearly_flights,
    };
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lifestyle', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const answers = req.body;

  try {
    await run(
      `INSERT INTO lifestyle_answers (
        user_id, commute_style, commute_distance, diet_style, local_food, 
        electricity_bill, green_energy, ac_usage, online_purchases, 
        delivery_frequency, digital_usage, waste_generation, yearly_flights
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        commute_style=excluded.commute_style,
        commute_distance=excluded.commute_distance,
        diet_style=excluded.diet_style,
        local_food=excluded.local_food,
        electricity_bill=excluded.electricity_bill,
        green_energy=excluded.green_energy,
        ac_usage=excluded.ac_usage,
        online_purchases=excluded.online_purchases,
        delivery_frequency=excluded.delivery_frequency,
        digital_usage=excluded.digital_usage,
        waste_generation=excluded.waste_generation,
        yearly_flights=excluded.yearly_flights`,
      [
        userId,
        answers.commuteStyle,
        answers.commuteDistance,
        answers.dietStyle,
        answers.localFood ? 1 : 0,
        answers.electricityBill,
        answers.greenEnergy ? 1 : 0,
        answers.acUsage,
        answers.onlinePurchases,
        answers.deliveryFrequency,
        answers.digitalUsage,
        answers.wasteGeneration,
        answers.yearlyFlights,
      ]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Receipts Endpoints
app.get('/api/receipts', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const items = await all('SELECT * FROM receipt_items WHERE user_id = ? ORDER BY date DESC', [userId]);
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/receipts', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const { id, name, category, carbon, cost, date } = req.body;

  try {
    await run(
      'INSERT INTO receipt_items (id, user_id, name, category, carbon, cost, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, userId, name, category, carbon, cost, date]
    );
    res.status(201).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/receipts/:id', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    await run('DELETE FROM receipt_items WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/receipts', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    await run('DELETE FROM receipt_items WHERE user_id = ?', [userId]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Action Checklists Endpoints
app.get('/api/actions', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const actions = await all<{ action_id: string }>('SELECT action_id FROM completed_actions WHERE user_id = ?', [userId]);
    res.json(actions.map(a => a.action_id));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/actions', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const { actionIds } = req.body;

  try {
    await run('DELETE FROM completed_actions WHERE user_id = ?', [userId]);
    if (Array.isArray(actionIds) && actionIds.length > 0) {
      const placeholders = actionIds.map(() => '(?, ?)').join(', ');
      const params = actionIds.flatMap(id => [userId, id]);
      await run(`INSERT INTO completed_actions (user_id, action_id) VALUES ${placeholders}`, params);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Challenge Status Endpoints
app.get('/api/challenges', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const data = await all<{ challenge_id: string; is_completed: number }>('SELECT challenge_id, is_completed FROM challenges WHERE user_id = ?', [userId]);
    res.json(data.map(item => ({ id: item.challenge_id, isCompleted: item.is_completed === 1 })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/challenges', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const { id, isCompleted } = req.body;

  try {
    await run(
      'INSERT INTO challenges (user_id, challenge_id, is_completed) VALUES (?, ?, ?) ON CONFLICT(user_id, challenge_id) DO UPDATE SET is_completed = excluded.is_completed',
      [userId, id, isCompleted ? 1 : 0]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Metadata sync (streak, badges, chat logs)
app.get('/api/user/sync', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const user = await get<{ streak: number; badges_json: string; chat_history_json: string }>(
      'SELECT streak, badges_json, chat_history_json FROM users WHERE id = ?',
      [userId]
    );
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json({
      streak: user.streak,
      badges: user.badges_json ? JSON.parse(user.badges_json) : null,
      chatHistory: user.chat_history_json ? JSON.parse(user.chat_history_json) : null
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/sync', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const { streak, badges, chatHistory } = req.body;

  try {
    await run(
      'UPDATE users SET streak = ?, badges_json = ?, chat_history_json = ? WHERE id = ?',
      [
        streak !== undefined ? streak : 1,
        badges ? JSON.stringify(badges) : null,
        chatHistory ? JSON.stringify(chatHistory) : null,
        userId
      ]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static assets from the frontend build directory
app.use(express.static(path.join(__dirname, '../../dist')));

// Fallback all other routes to index.html (for client-side routing)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    next();
    return;
  }
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
