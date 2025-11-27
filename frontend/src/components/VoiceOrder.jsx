import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_URL = import.meta.env.PROD
  ? 'https://voice-order-app.vercel.app/api'
  : '/api';

function VoiceOrder({ onOrderComplete }) {
  const [sessionId] = useState(uuidv4());
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const greetedRef = useRef(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);

        setMessages(prev => [...prev, { type: 'user', text }]);
        await sendMessage(text);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
    if (!greetedRef.current) {
      sendMessage('Greet the customer');
      greetedRef.current = true;
    }

    return () => recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${API_URL}/chat`, {
        sessionId,
        message: text,
        conversationHistory
      });

      const { response: aiResponse, isOrderComplete, orderData, history } = response.data;

      setConversationHistory(history || []);

      if (isOrderComplete && orderData) {
        setMessages(prev => [
          ...prev,
          { type: 'assistant', text: 'Your order is complete. Here is your summary:' }
        ]);
        setTimeout(() => {
          onOrderComplete(orderData);
        }, 500);
      } else {
        setMessages(prev => [...prev, { type: 'assistant', text: aiResponse }]);
        speakText(aiResponse);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { type: 'error', text: 'Sorry, there was an error processing your order. Please try again.' }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text) => {
    const cleanText = text.replace(/\{[\s\S]*\}/g, '').trim();
    if (cleanText && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-red-700 text-white p-6">
          <h2 className="text-3xl font-semibold text-center">Voice Order System</h2>
          <p className="text-center mt-2">Speak naturally to place your order</p>
        </div>

        <div className="h-96 overflow-y-auto p-6 bg-gray-100">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-red-600 text-white'
                    : msg.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-white text-gray-800 shadow'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="text-left mb-4">
              <div className="inline-block bg-white text-gray-800 shadow px-4 py-3 rounded-lg">
                Processing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-white border-t border-gray-200 flex flex-col items-center space-y-4">
          <button
            onClick={startListening}
            disabled={isListening || isProcessing}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold transition-all transform ${
              isListening
                ? 'bg-red-500 animate-pulse scale-110'
                : isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-700 hover:bg-red-800 hover:scale-105 active:scale-95'
            } text-white shadow`}
          >
            Start
          </button>
          <p className="text-gray-600 text-center">
            {isListening
              ? 'Listening...'
              : isProcessing
              ? 'Processing...'
              : 'Click the button to speak'}
          </p>
          {transcript && (
            <p className="text-sm text-gray-500 italic">Last: "{transcript}"</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceOrder;
