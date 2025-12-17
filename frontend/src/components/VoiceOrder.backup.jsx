import { useEffect, useRef, useState } from 'react';

const BACKEND_WS_URL = import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:3001';

function VoiceOrder({ onOrderComplete }) {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Initializing...');

  const wsRef = useRef(null);
  const inputAudioContextRef = useRef(null);
  const outputAudioContextRef = useRef(null);
  const inputNodeRef = useRef(null);
  const outputNodeRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const audioSourcesRef = useRef(new Set());
  const nextStartTimeRef = useRef(0);

  // Initialize WebSocket connection to backend
  useEffect(() => {
    const initConnection = async () => {
      try {
        // Initialize Audio Contexts
        inputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 16000
        });
        outputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 24000
        });

        inputNodeRef.current = inputAudioContextRef.current.createGain();
        outputNodeRef.current = outputAudioContextRef.current.createGain();
        outputNodeRef.current.connect(outputAudioContextRef.current.destination);

        // Connect to backend WebSocket
        const ws = new WebSocket(BACKEND_WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connected to backend WebSocket');
          setConnectionStatus('connecting');
          setStatus('Connecting to voice service...');
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          
          if (message.type === 'connected') {
            console.log('Backend connected to Gemini');
            setConnectionStatus('connected');
            setStatus('Connected. Click Start to begin.');
          } else if (message.type === 'gemini_message') {
            handleGeminiMessage(message.data);
          } else if (message.type === 'error') {
            console.error('Backend error:', message.message);
            setConnectionStatus('error');
            setStatus(`Error: ${message.message}`);
          } else if (message.type === 'disconnected') {
            setConnectionStatus('disconnected');
            setStatus('Disconnected');
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('error');
          setStatus('Connection error');
        };

        ws.onclose = () => {
          console.log('WebSocket closed');
          setConnectionStatus('disconnected');
          setStatus('Disconnected');
        };

      } catch (error) {
        console.error('Failed to initialize:', error);
        setConnectionStatus('error');
        setStatus(`Error: ${error.message}`);
      }
    };

    initConnection();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onOrderComplete]);

  const handleGeminiMessage = (message) => {
    console.log('Gemini message received:', message);
    if (message.serverContent?.modelTurn?.parts) {
      for (const part of message.serverContent.modelTurn.parts) {
        // Handle text responses
        if (part.text) {
          const text = part.text;
          
          // Check for order completion FIRST
          if (text.includes('ORDER_COMPLETE')) {
            console.log('Order complete marker found!');
            const cleanedText = text.replace(/```json\s*/g, '').replace(/```/g, '');
            const jsonMatch = cleanedText.match(/\{[\s\S]*?\}/);
            if (jsonMatch) {
              try {
                const orderData = JSON.parse(jsonMatch[0]);
                console.log('Order data parsed:', orderData);
                onOrderComplete(orderData);
              } catch (e) {
                console.error('Error parsing order JSON:', e);
              }
            }
          }

          // Remove ALL thinking/reasoning patterns
          let cleanText = text
            .replace(/\*\*[^*]+\*\*[^\n]*/g, '') // **Title** format
            .replace(/ORDER_COMPLETE/gi, '')
            .replace(/```json\s*/g, '')
            .replace(/```/g, '')
            .replace(/^\s*\{[\s\S]*?\}\s*$/gm, '')
            .split('\n')
            .filter(line => {
              const trimmed = line.trim();
              // Remove thinking/reasoning sentences
              if (trimmed.match(/^(I'm|I've|I'am|I\'ve|I am|My |I need|Let me|I'll |I should|I'm focusing|I'm starting|I'm now|I realized|I have|The user|I processed|I received|I've got|I got|I'm getting|I'm putting|I'm planning|I'm moving|I'm checking)/i)) {
                return false;
              }
              return trimmed.length > 0;
            })
            .join('\n')
            .trim();

          if (cleanText) {
            setMessages((prev) => [...prev, { type: 'assistant', text: cleanText }]);
          }
        }

        // Handle audio responses
        if (part.inlineData?.data) {
          playAudio(part.inlineData.data);
        }
      }
    }

    if (message.serverContent?.interrupted) {
      // Stop current audio playback
      audioSourcesRef.current.forEach((source) => {
        source.stop();
        audioSourcesRef.current.delete(source);
      });
      nextStartTimeRef.current = 0;
    }
  };

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
      // Gemini sends signed 16-bit PCM at 24kHz (2 bytes per sample)
      const samples = bytes.length / 2;
      const audioBuffer = audioContext.createBuffer(1, samples, 24000);
      const channelData = audioBuffer.getChannelData(0);

      // Convert bytes to signed 16-bit samples
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      for (let i = 0; i < samples; i++) {
        const int16 = view.getInt16(i * 2, true); // true = little-endian
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
      
      // Set flag directly on ref, not state (state is async)
      const isRecordingRef = { current: true };

      scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
        if (!isRecordingRef.current) return;

        const inputBuffer = audioProcessingEvent.inputBuffer;
        const pcmData = inputBuffer.getChannelData(0);
        
        // Convert float32 to int16 PCM
        const int16Data = new Int16Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
          int16Data[i] = Math.max(-1, Math.min(1, pcmData[i])) * 0x7fff;
        }
        
        // Convert to base64 for Live API
        let binary = '';
        const bytes = new Uint8Array(int16Data.buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Audio = btoa(binary);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          try {
            wsRef.current.send(JSON.stringify({
              type: 'audio',
              data: base64Audio
            }));
            console.log('Audio sent to backend');
          } catch (error) {
            console.error('Error sending audio:', error);
          }
        }
      };

      sourceNode.connect(scriptProcessor);
      scriptProcessor.connect(inputAudioContextRef.current.destination);

      // Store ref for stopRecording
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
    
    // Stop recording immediately via ref
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-red-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-center">Live Voice Order</h2>
            <p className="text-sm opacity-90">{status}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-green-600'
                  : connectionStatus === 'error'
                  ? 'bg-red-600'
                  : 'bg-amber-500'
              }`}
              aria-hidden
            />
            <span className="text-sm capitalize">{connectionStatus}</span>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-6 bg-gray-100">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 ${msg.type === 'assistant' ? 'text-left' : 'text-right'}`}
            >
              <div
                className={`inline-block max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                  msg.type === 'assistant'
                    ? 'bg-white text-gray-800 shadow'
                    : msg.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${
                isListening ? 'bg-green-600 animate-pulse' : 'bg-gray-400'
              }`}
            >
              🎙️
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {isListening ? 'Listening...' : 'Ready to order'}
              </p>
              <p className="text-sm text-gray-500">
                {isListening ? 'Responses play automatically.' : 'Click Start to begin.'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetSession}
              className="px-4 py-3 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-all"
              disabled={isListening}
            >
              Reset
            </button>
            {!isListening ? (
              <button
                onClick={startRecording}
                className="px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all"
              >
                Start
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-6 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceOrder;
