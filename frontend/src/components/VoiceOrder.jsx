import { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const SYSTEM_PROMPT = `You are a Korean restaurant order taker. Respond ONLY with what the customer should hear.

MENU ITEMS:
Bibimbap $12.99 | Bulgogi $15.99 | Kimchi Jjigae $11.99 | Japchae $10.99 | Tteokbokki $9.99 | Korean Fried Chicken $13.99 | Samgyeopsal $16.99 | Seafood Pancake $11.99 | Soju $8.99 | Makgeolli $7.99

RESPONSE EXAMPLES:
Customer: "I'll have bulgogi"
You: "Got it, bulgogi. Anything else?"

Customer: "Add kimchi jjigae"
You: "Sure, kimchi jjigae added. What else?"

Customer: "That's all"
You: "Perfect! Your order is ready."

CRITICAL RULES:
- Output ONLY the spoken response (10 words max)
- NO thinking, NO explanations, NO bold text, NO meta-commentary
- When customer says done/that's all → respond with EXACTLY: "Perfect! Your order is ready."
- Do NOT describe what you're doing or planning
- Speak naturally like a real order taker`;

function VoiceOrder({ onOrderComplete }) {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [currentOrder, setCurrentOrder] = useState({ items: [], total: 0 });
  const [audioLevel, setAudioLevel] = useState(0);

  const MENU_ITEMS = {
    'bibimbap': { name: 'Bibimbap', price: 12.99 },
    'bulgogi': { name: 'Bulgogi', price: 15.99 },
    'kimchi jjigae': { name: 'Kimchi Jjigae', price: 11.99 },
    'japchae': { name: 'Japchae', price: 10.99 },
    'tteokbokki': { name: 'Tteokbokki', price: 9.99 },
    'korean fried chicken': { name: 'Korean Fried Chicken', price: 13.99 },
    'fried chicken': { name: 'Korean Fried Chicken', price: 13.99 },
    'samgyeopsal': { name: 'Samgyeopsal', price: 16.99 },
    'seafood pancake': { name: 'Seafood Pancake', price: 11.99 },
    'soju': { name: 'Soju', price: 8.99 },
    'makgeolli': { name: 'Makgeolli', price: 7.99 }
  };

  const clientRef = useRef(null);
  const sessionRef = useRef(null);
  const currentOrderRef = useRef({ items: [], total: 0 });
  const inputAudioContextRef = useRef(null);
  const outputAudioContextRef = useRef(null);
  const inputNodeRef = useRef(null);
  const outputNodeRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const audioSourcesRef = useRef(new Set());
  const nextStartTimeRef = useRef(0);
  const initializedRef = useRef(false);
  const systemPromptSentRef = useRef(false);

  useEffect(() => {
    const initClient = async () => {
      try {
        inputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 16000
        });
        outputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 24000
        });

        inputNodeRef.current = inputAudioContextRef.current.createGain();
        outputNodeRef.current = outputAudioContextRef.current.createGain();
        outputNodeRef.current.connect(outputAudioContextRef.current.destination);

        setStatus('Fetching auth token...');
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        const tokenResponse = await fetch(`${backendUrl}/api/get-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!tokenResponse.ok) {
          const error = await tokenResponse.json();
          throw new Error(`Token fetch failed: ${error.error}`);
        }

        const { token } = await tokenResponse.json();
        console.log('Ephemeral token received:', token);

        const client = new GoogleGenAI({ 
          apiKey: token,
          httpOptions: { apiVersion: 'v1alpha' }
        });
        clientRef.current = client;

        const session = await client.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: SYSTEM_PROMPT,
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Puck' }
              }
            }
          },
          callbacks: {
            onopen: () => {
              console.log('Connected to Gemini Live API');
              setConnectionStatus('connected');
              setStatus('Connected. Click Start to begin.');
            },
            onmessage: (message) => {
              console.log('Live API message received:', message);
              if (message.serverContent?.modelTurn?.parts) {
                console.log('Parts received:', message.serverContent.modelTurn.parts.length);
                for (const part of message.serverContent.modelTurn.parts) {
                  console.log('Part type:', { hasText: !!part.text, hasAudio: !!part.inlineData });
                  
                  // Handle text responses
                  if (part.text) {
                    const text = part.text;
                    console.log('Full text content:', text);
                    console.log('Text length:', text.length);
                    
                    // Parse order items from text
                    const lowerText = text.toLowerCase();
                    for (const [key, item] of Object.entries(MENU_ITEMS)) {
                      if (lowerText.includes(key)) {
                        // Extract quantity if mentioned
                        const quantityMatch = text.match(new RegExp(`(\\d+)\\s*${key}`, 'i')) || 
                                            text.match(new RegExp(`${key}.*?(\\d+)`, 'i'));
                        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
                        
                        // Add or update item in order
                        setCurrentOrder(prev => {
                          const existingIndex = prev.items.findIndex(i => i.name === item.name);
                          let newItems;
                          
                          if (existingIndex >= 0) {
                            newItems = [...prev.items];
                            newItems[existingIndex].quantity += quantity;
                          } else {
                            newItems = [...prev.items, { ...item, quantity }];
                          }
                          
                          const total = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
                          const newOrder = { items: newItems, total };
                          console.log('Order updated:', newOrder);
                          
                          // Update ref so we always have latest value
                          currentOrderRef.current = newOrder;
                          
                          return newOrder;
                        });
                        break;
                      }
                    }
                    
                    // Check for order completion phrase (before filtering!)
                    if (text.toLowerCase().includes('your order is ready')) {
                      console.log('Order ready phrase detected! Auto-completing...');
                      console.log('Current order from state:', currentOrder);
                      console.log('Current order from ref:', currentOrderRef.current);
                      
                      // Use ref to get the absolute latest order data
                      const orderToComplete = currentOrderRef.current;
                      console.log('Completing with order:', orderToComplete);
                      
                      if (orderToComplete.items.length > 0) {
                        onOrderComplete(orderToComplete);
                      } else {
                        console.warn('Order is empty, not triggering completion');
                      }
                    }
                    
                    // Legacy ORDER_COMPLETE check
                    if (text.includes('ORDER_COMPLETE')) {
                      console.log('Order complete marker found!');
                      console.log('Full ORDER_COMPLETE text:', text);
                      
                      const cleanedText = text.replace(/```json\s*/g, '').replace(/```/g, '');
                      const jsonMatch = cleanedText.match(/\{[\s\S]*?\}/);
                      
                      console.log('JSON match result:', jsonMatch);
                      
                      if (jsonMatch) {
                        try {
                          const orderData = JSON.parse(jsonMatch[0]);
                          console.log('Order data parsed:', orderData);
                          onOrderComplete(orderData);
                        } catch (e) {
                          console.error('Error parsing order JSON:', e);
                          console.error('Attempted to parse:', jsonMatch[0]);
                        }
                      } else {
                        console.error('No JSON found in text after ORDER_COMPLETE');
                      }
                    }

                    // Remove ALL thinking/reasoning patterns
                    let cleanText = text
                      // Remove bold headings with their following paragraph
                      .replace(/\*\*[^*]+\*\*[\s\S]*?(?=\n\n|\n[A-Z]|$)/g, '')
                      // Remove markdown bold
                      .replace(/\*\*([^*]+)\*\*/g, '$1')
                      // Remove code blocks and JSON
                      .replace(/ORDER_COMPLETE/gi, '')
                      .replace(/```json\s*/g, '')
                      .replace(/```/g, '')
                      .replace(/^\s*\{[\s\S]*?\}\s*$/gm, '')
                      .split('\n')
                      .filter(line => {
                        const trimmed = line.trim();
                        // Skip empty lines
                        if (!trimmed) return false;
                        
                        // Filter out thinking patterns
                        if (trimmed.match(/^(I'm|I've|I'am|I am|I will|I'll|My |I need|Let me|I should|I realized|I have|The user|I processed|I received|I noted|I prioritiz|This response|This will|As directed|maintaining|I\'ve noted)/i)) {
                          return false;
                        }
                        
                        // Filter out meta-commentary about the conversation
                        if (trimmed.match(/(serve as|culmination|process|brevity|clarity|conversational tone|definitive|finalize|prioritizing)/i)) {
                          return false;
                        }
                        
                        return true;
                      })
                      .join('\n')
                      .trim();

                    console.log('Cleaned text:', cleanText);
                    console.log('Cleaned text length:', cleanText.length);

                    if (cleanText) {
                      setMessages((prev) => [...prev, { type: 'assistant', text: cleanText }]);
                    } else {
                      console.warn('All text was filtered out - bot may be only outputting thinking text');
                    }
                  }

                  // Handle audio responses
                  if (part.inlineData?.data) {
                    playAudio(part.inlineData.data);
                  }
                }
              }

              if (message.serverContent?.interrupted) {
                audioSourcesRef.current.forEach((source) => {
                  source.stop();
                  audioSourcesRef.current.delete(source);
                });
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => {
              console.error('Live API error:', e);
              setConnectionStatus('error');
              setStatus(`Error: ${e.message}`);
            },
            onclose: (e) => {
              console.log('Live API closed:', e.reason);
              setConnectionStatus('disconnected');
              setStatus('Disconnected');
            }
          }
        });

        sessionRef.current = session;
      } catch (error) {
        console.error('Failed to initialize Live API:', error);
        setConnectionStatus('error');
        setStatus(`Error: ${error.message}`);
      }
    };

    initClient();

    return () => {
      if (sessionRef.current) {
        sessionRef.current.close();
      }
    };
  }, [onOrderComplete]);

  const playAudio = async (base64Audio) => {
    try {
      // Decode base64 to binary
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create audio buffer
      const audioContext = outputAudioContextRef.current;
      const samples = bytes.length / 2;
      const audioBuffer = audioContext.createBuffer(1, samples, 24000);
      const channelData = audioBuffer.getChannelData(0);

      // Convert bytes to signed 16-bit samples
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      for (let i = 0; i < samples; i++) {
        const int16 = view.getInt16(i * 2, true);
        channelData[i] = int16 / 32768; // normalize to [-1, 1]
      }

      // Play audio
      nextStartTimeRef.current = Math.max(
        nextStartTimeRef.current,
        audioContext.currentTime
      );

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputNodeRef.current);
      source.addEventListener('ended', () => {
        audioSourcesRef.current.delete(source);
      });

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
      audioSourcesRef.current.add(source);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const startRecording = async () => {
    try {
      if (inputAudioContextRef.current) {
        inputAudioContextRef.current.resume();
      }

      setStatus('Requesting microphone access...');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      mediaStreamRef.current = stream;

      const sourceNode = inputAudioContextRef.current.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;
      sourceNode.connect(inputNodeRef.current);

      const bufferSize = 256;
      const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(
        bufferSize,
        1,
        1
      );
      scriptProcessorRef.current = scriptProcessor;
      
      const isRecordingRef = { current: true };

      scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
        if (!isRecordingRef.current) return;

        const inputBuffer = audioProcessingEvent.inputBuffer;
        const pcmData = inputBuffer.getChannelData(0);
        
        // Calculate audio level for visualization
        let sum = 0;
        for (let i = 0; i < pcmData.length; i++) {
          sum += pcmData[i] * pcmData[i];
        }
        const rms = Math.sqrt(sum / pcmData.length);
        setAudioLevel(Math.min(rms * 10, 1)); // Scale and cap at 1
        
        const int16Data = new Int16Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
          int16Data[i] = Math.max(-1, Math.min(1, pcmData[i])) * 0x7fff;
        }
        
        let binary = '';
        const bytes = new Uint8Array(int16Data.buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Audio = btoa(binary);

        if (sessionRef.current) {
          try {
            sessionRef.current.sendRealtimeInput({
              media: {
                mimeType: "audio/pcm",
                data: base64Audio
              }
            });
          } catch (error) {
            console.error('Error sending audio:', error);
          }
        }
      };

      sourceNode.connect(scriptProcessor);
      scriptProcessor.connect(inputAudioContextRef.current.destination);

      sourceNodeRef.current.isRecordingRef = isRecordingRef;

      setIsListening(true);
      setStatus('🔴 Recording... Speak now');
    } catch (error) {
      console.error('Error starting recording:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const stopRecording = () => {
    setIsListening(false);
    setAudioLevel(0);
    
    if (sourceNodeRef.current?.isRecordingRef) {
      sourceNodeRef.current.isRecordingRef.current = false;
    }

    if (scriptProcessorRef.current && sourceNodeRef.current) {
      scriptProcessorRef.current.disconnect();
      sourceNodeRef.current.disconnect();
      scriptProcessorRef.current = null;
      sourceNodeRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setStatus('Recording stopped. Click Start to begin again.');
  };

  const resetSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setMessages([]);
    setStatus('Session reset. Reconnecting...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-red-800/30 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Voice Order</h2>
            <p className="text-xs sm:text-sm text-red-200 mt-1">{status}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-green-500 animate-pulse'
                  : connectionStatus === 'error'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }`}
            />
            <span className="text-xs sm:text-sm text-white/80 capitalize hidden sm:inline">{connectionStatus}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full">
          
          {/* Voice Visualization */}
          <div className="mb-6 sm:mb-8">
            <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-red-800/30 shadow-2xl">
              {/* Waveform Bars */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 h-32 sm:h-40">
                {[...Array(12)].map((_, i) => {
                  const delay = i * 0.1;
                  const height = isListening 
                    ? `${20 + audioLevel * 80 * (1 - Math.abs(i - 5.5) / 6)}%` 
                    : '20%';
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-red-600 to-red-400 rounded-full transition-all duration-150"
                      style={{
                        height,
                        transitionDelay: `${delay}s`,
                        opacity: isListening ? 0.6 + audioLevel * 0.4 : 0.3,
                      }}
                    />
                  );
                })}
              </div>

              {/* Center Mic Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`${isListening ? 'animate-pulse' : ''}`}>
                  <svg 
                    className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-lg" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Current Order Display */}
          {currentOrder.items.length > 0 && (
            <div className="mb-6 bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-red-800/30">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Current Order</h3>
              <div className="space-y-2">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-red-100">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-semibold text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-red-800/50 flex justify-between items-center">
                <span className="text-base sm:text-lg font-bold text-white">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-red-400">
                  ${currentOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {!isListening ? (
              <button
                onClick={startRecording}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-base sm:text-lg"
              >
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Start Ordering
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={stopRecording}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-base sm:text-lg"
                >
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded"></div>
                    Stop
                  </span>
                </button>
                <button
                  onClick={() => {
                    const orderToComplete = currentOrderRef.current;
                    console.log('Manual complete - order:', orderToComplete);
                    if (orderToComplete.items.length === 0) {
                      alert('No items in order. Talk to add items first!');
                      return;
                    }
                    onOrderComplete(orderToComplete);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base sm:text-lg"
                  disabled={currentOrder.items.length === 0}
                >
                  Complete {currentOrder.items.length > 0 && `(${currentOrder.items.length})`}
                </button>
              </>
            )}
          </div>

          {/* Reset Button */}
          {!isListening && (
            <div className="mt-4 text-center">
              <button
                onClick={resetSession}
                className="text-red-300 hover:text-white text-sm sm:text-base underline transition-colors"
              >
                Reset Session
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer Hint */}
      <div className="bg-black/30 backdrop-blur-md border-t border-red-800/30 p-3 sm:p-4 text-center">
        <p className="text-xs sm:text-sm text-red-200">
          {isListening ? '🎤 Listening... Speak your order naturally' : 'Tap "Start Ordering" and say what you want'}
        </p>
      </div>
    </div>
  );
}
export default VoiceOrder;
