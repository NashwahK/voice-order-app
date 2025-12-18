# Voice Order App

🎤 **Order your favorite Korean dishes with your voice!**

A full-stack voice ordering application powered by Gemini's Live API, featuring real-time audio streaming, ephemeral token authentication, and PostgreSQL persistence.

![Voice Ordering Demo](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Gemini API](https://img.shields.io/badge/Gemini-Live%20API-orange)

## ✨ Features

- 🎙️ **Real-time Voice Interaction** - Natural conversation with Gemini's native audio model
- 🌊 **Waveform Visualization** - Animated voice activity indicator
- 🔒 **Secure Authentication** - Ephemeral tokens protect API keys
- 🍜 **Korean Restaurant Menu** - 10 authentic dishes with descriptions
- 🧾 **Receipt-Style Confirmation** - Professional order display with tax calculation
- 💾 **Database Persistence** - Orders saved to Neon PostgreSQL
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   React Frontend│◄───────►│  Express Backend │◄───────►│ Neon Database│
│                 │         │                  │         │              │
│ • Voice UI      │  HTTP   │ • Token Gen      │   SQL   │ • Orders     │
│ • Waveform      │  WebSocket│ • Order API   │         │              │
│ • Order Tracking│         │ • CORS Config    │         │              │
└─────────────────┘         └──────────────────┘         └──────────────┘
         │                           │
         │                           │
         └───────────────┬───────────┘
                         │
                 ┌───────▼────────┐
                 │  Gemini Live   │
                 │      API       │
                 │ • Audio Stream │
                 │ • Ephemeral    │
                 │   Tokens       │
                 └────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- Neon PostgreSQL database ([Create one here](https://console.neon.tech))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/NashwahK/voice-order-app.git
   cd voice-order-app
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your API keys
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with backend URL
   npm run dev
   ```

4. **Setup Database**
   ```bash
   # Run the SQL in backend/schema.sql in your Neon console
   ```

Visit `http://localhost:5173` and start ordering! 🎉

## 📚 Documentation

- [Full Deployment Guide](DEPLOYMENT.md) - Complete setup and deployment instructions
- [Frontend README](frontend/README.md) - Frontend-specific documentation
- [Database Schema](backend/schema.sql) - Database structure

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.0 + Vite 7.2.4
- **Styling**: TailwindCSS 4.1.17
- **AI SDK**: @google/genai 1.34.0
- **Audio**: Web Audio API

### Backend
- **Runtime**: Node.js with Express 5.1.0
- **AI SDK**: @google/genai 1.34.0
- **Database**: Neon PostgreSQL (@neondatabase/serverless)
- **Security**: CORS, Ephemeral Tokens

### AI Model
- **Model**: gemini-2.5-flash-native-audio-preview-12-2025
- **API**: Gemini Live API with native audio streaming
- **Auth**: Ephemeral tokens (30min expiry)

## 🔐 Security

- ✅ API keys stored server-side only
- ✅ Ephemeral tokens expire after 30 minutes
- ✅ CORS configured with allowed origins
- ✅ Environment variables git-ignored
- ✅ Input validation on all endpoints

## 📝 How It Works

1. **Frontend requests ephemeral token** from backend
2. **Backend generates token** using Gemini API key
3. **Frontend establishes WebSocket** connection to Gemini with token
4. **User speaks** → Audio streamed in real-time to Gemini
5. **Gemini responds** → Audio and text streamed back
6. **Order parsed** from conversation and displayed in UI
7. **User confirms** → Order saved to database

## 🎯 Menu Items

- 🍚 Bibimbap (비빔밥) - $12.99
- 🥘 Kimchi Jjigae (김치찌개) - $11.99
- 🍖 Bulgogi (불고기) - $14.99
- 🍜 Japchae (잡채) - $10.99
- 🥟 Mandu (만두) - $8.99
- 🍲 Doenjang Jjigae (된장찌개) - $11.99
- 🥩 Galbi (갈비) - $16.99
- 🍚 Gimbap (김밥) - $9.99
- 🍛 Haemul Pajeon (해물파전) - $13.99
- 🍜 Naengmyeon (냉면) - $12.99

## 🧪 Testing

```bash
# Backend health check
curl http://localhost:3001/api/health

# Frontend
cd frontend && npm run lint
```

## 📦 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:
- Vercel deployment (recommended)
- Environment configuration
- Database setup
- Post-deployment checklist

## 🐛 Known Limitations

- Voice model occasionally outputs "thinking text" despite prompt engineering
- Text filtering applied to clean responses
- Structured JSON output from voice models is unreliable (using phrase detection instead)
- Requires modern browsers with Web Audio API support

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Google Gemini team for the Live API
- Neon for serverless PostgreSQL
- React and Vite communities

## 📧 Support

- 📁 [GitHub Issues](https://github.com/NashwahK/voice-order-app/issues)
- 📖 [Gemini API Docs](https://ai.google.dev/docs)
- 📖 [Neon Docs](https://neon.tech/docs)

---

Made with ❤️ and 🎤 by [NashwahK](https://github.com/NashwahK)
