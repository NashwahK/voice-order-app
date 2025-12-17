import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

// Generate ephemeral token for Gemini Live API
app.post('/api/get-token', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Request ephemeral token from Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1alpha/cachedContents:ephemeralToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        ttl: '300s' // Token valid for 5 minutes
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Token generation failed:', error);
      return res.status(response.status).json({ error: 'Failed to generate token' });
    }

    const data = await response.json();
    res.json({ token: data.token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
