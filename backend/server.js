import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is missing");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// SYSTEM PROMPT
const SYSTEM_PROMPT = `
You are a professional Korean restaurant voice order assistant.
Available menu:
- Kimchi Jjigae $12
- Bibimbap $14
- Bulgogi $18
- Tteokbokki $10
- Japchae $13
- Korean Fried Chicken $16
- Samgyeopsal $20
Confirm each item and quantity exactly.
Never add items not ordered.
Ask if the customer wants anything else after each item.
Only output JSON when the user says they are done.
JSON format:
{"orderComplete":true,"items":[{"name":"Item Name","price":12,"quantity":2,"notes":""}],"total":0}
No emojis. No extra text.
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT }]
      }
    });

    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.type === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      })),
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7
      }
    });

    const result = await chat.sendMessage(message);
    const aiText = result.response.text();

    let isOrderComplete = false;
    let orderData = null;

    try {
      const match = aiText.match(/\{[\s\S]*\}/);
      if (match) {
        orderData = JSON.parse(match[0]);
        if (orderData.orderComplete) isOrderComplete = true;
      }
    } catch {}

    const updatedHistory = [
      ...conversationHistory,
      { type: "user", text: message },
      { type: "assistant", text: aiText }
    ];

    return res.json({
      response: aiText,
      isOrderComplete,
      orderData,
      history: updatedHistory
    });

  } catch (err) {
    console.error("💥 /api/chat crashed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
export default app;
