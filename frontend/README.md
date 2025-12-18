# Voice Order App - Frontend

Order your favorite Korean dishes with your voice! This frontend uses React + Vite with Gemini's Live API for real-time voice interactions.

## Features

- 🎤 Real-time voice ordering with Gemini Live API
- 🌊 Animated waveform visualization during conversation
- 🍜 10 authentic Korean dishes with descriptions
- 🧾 Receipt-style order confirmation
- 📱 Fully responsive design with TailwindCSS
- 🔒 Secure ephemeral token authentication

## Tech Stack

- React 19.2.0
- Vite 7.2.4
- TailwindCSS 4.1.17
- @google/genai 1.34.0
- Axios for HTTP requests

## Getting Started

See [DEPLOYMENT.md](../DEPLOYMENT.md) in the root directory for complete setup instructions.

### Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
```

## Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── LandingPage.jsx    # Menu display
│   ├── VoiceOrder.jsx      # Voice interaction
│   └── OrderModal.jsx      # Order confirmation
├── App.jsx                 # Main app & routing
├── main.jsx                # React entry point
└── index.css               # Global styles
```

## Environment Variables

Create `.env` from `.env.example`:

```
VITE_BACKEND_URL=http://localhost:3001
```

For production, set this to your deployed backend URL.

## Browser Compatibility

Requires browsers with:
- Web Audio API support
- MediaRecorder API support
- ES2020+ features

Tested on: Chrome 90+, Edge 90+, Safari 14+
