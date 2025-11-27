import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = 
  "You are a professional Korean restaurant voice order assistant. " +
  "Available menu: Kimchi Jjigae $12, Bibimbap $14, Bulgogi $18, Tteokbokki $10, Japchae $13, Korean Fried Chicken $16, Samgyeopsal $20. " +
  "Confirm each item and quantity exactly as the user requests. Never add items not ordered. Ask if the customer wants anything else after each item. " +
  "Only output JSON when the user confirms they are done. The JSON should follow this format exactly: " +
  "{\"orderComplete\":true,\"items\":[{\"name\":\"Item Name\",\"price\":12,\"quantity\":2,\"notes\":\"\"}],\"total\":0}. " +
  "Do not include emojis or extra text in the JSON.";


app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], isInitial } = req.body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: SYSTEM_PROMPT
    });

    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
    });

    const result = await chat.sendMessage(message);
    const aiResponse = result.response.text();
    let isOrderComplete = false;
    let orderData = null;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        orderData = JSON.parse(jsonMatch[0]);
        if (orderData.orderComplete) isOrderComplete = true;
      }
    } catch {}

    // this thing is bugging me FLAG:CHECK AGAIN
    const updatedHistory = [
      ...conversationHistory,
      { type: 'user', text: message },
      { type: 'assistant', text: aiResponse }
    ];

    res.json({ 
      response: aiResponse, 
      isOrderComplete, 
      orderData, 
      history: updatedHistory 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
