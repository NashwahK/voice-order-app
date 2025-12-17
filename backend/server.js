import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sql } from './db.js';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Voice ordering app backend is running'
  });
});

app.post('/api/get-token', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const client = new GoogleGenAI({ 
      apiKey,
      httpOptions: { apiVersion: 'v1alpha' }
    });

    const now = new Date();
    const expireTime = new Date(now.getTime() + 30 * 60000); // 30 minutes
    const newSessionExpireTime = new Date(now.getTime() + 60000); // 1 minute

    const token = await client.authTokens.create({
      config: {
        uses: 1,
        expireTime: expireTime.toISOString(),
        newSessionExpireTime: newSessionExpireTime.toISOString(),
        httpOptions: { apiVersion: 'v1alpha' }
      }
    });

    console.log('Ephemeral token created:', token);
    console.log('Token name:', token.name);
    res.json({ token: token.name });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, owner } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order: items required' });
    }

    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ error: 'Invalid order: valid total required' });
    }

    const result = await sql`
      INSERT INTO orders (order_details, order_total, order_owner)
      VALUES (${JSON.stringify(items)}, ${total}, ${owner || 'Anonymous'})
      RETURNING order_id, order_details, order_total, order_owner
    `;

    res.status(201).json({
      success: true,
      order: result[0]
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
