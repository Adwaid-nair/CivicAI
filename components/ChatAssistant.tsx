import React, { useState, useEffect, useRef } from 'react';
import { askChatAssistant } from '../services/geminiService';

export interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatAssistantProps {
  embedded?: boolean;
  systemInstruction?: string;
  initialMessage?: string;
  onClose?: () => void;
  onApplyContent?: (content: string) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  embedded = false, 
  systemInstruction, 
  initialMessage,
  onClose,
  onApplyContent
}) => {
  const [isOpen, setIsOpen] = useState(embedded ? true : false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (messages.length === 0) {
        setMessages([{ 
            role: 'model', 
            text: initialMessage || "Hi! I'm the CivicAI Assistant. Ask me how to use the app!" 
        }]);
    }
  }, [initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\*\*/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await askChatAssistant(text, messages, systemInstruction);
      const botMsg: Message = { role: 'model', text: responseText };
      setMessages(prev => [...prev, botMsg]);
      speak(responseText);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    try {
      // @ts-ignore
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        window.speechSynthesis.cancel();
      };
      
      recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
                handleSend(transcript);
            }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
            alert("Microphone access denied. Please allow microphone permissions in your browser settings.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      setIsListening(false);
    }
  };

  const formatMessage = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => 
      index % 2 === 1 ? <strong key={index} className="font-bold">{part}</strong> : part
    );
  };

  const containerStyle = embedded 
    ? "w-full border border-slate-200 rounded-xl bg-white overflow-hidden flex flex-col shadow-sm h-96 mt-4 transition-all"
    : "fixed bottom-6 right-6 z-[1000] flex flex-col items-end";
    
  const chatWindowStyle = embedded
    ? "flex flex-col h-full"
    : "bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 mb-4 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right";

  return (
    <div className={containerStyle}>
      {(isOpen || embedded) && (
        <div className={chatWindowStyle}>
          
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
               <div className="bg-white/20 p-1.5 rounded-lg">
                  <i className="fa-solid fa-robot"></i>
               </div>
               <div>
                  <h3 className="font-bold text-sm">CivicAI Assistant</h3>
                  <p className="text-[10px] text-blue-100 opacity-90">{embedded ? 'Form Helper' : 'Voice Enabled Guide'}</p>
               </div>
            </div>
            {embedded ? (
                onClose && (
                    <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded transition-colors text-blue-100 hover:text-white">
                         <span className="text-xs font-medium mr-1">Close</span> <i className="fa-solid fa-times"></i>
                    </button>
                )
            ) : (
                <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded transition-colors">
                    <i className="fa-solid fa-times"></i>
                </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                }`}>
                  {formatMessage(msg.text)}
                </div>
                {msg.role === 'model' && onApplyContent && embedded && (
                    <button 
                        onClick={() => onApplyContent(msg.text.replace(/\*\*/g, ''))} 
                        className="text-[10px] text-blue-600 font-medium hover:text-blue-800 hover:underline mt-1 ml-1 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 transition-colors"
                    >
                        <i className="fa-regular fa-copy"></i> Use this description
                    </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-2 border border-slate-100 shadow-sm flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
             <button 
               onClick={toggleListening}
               className={`p-3 rounded-full transition-all flex-shrink-0 ${
                 isListening 
                  ? 'bg-red-500 text-white animate-pulse shadow-red-200 shadow-lg' 
                  : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
               }`}
               title={isListening ? "Stop listening" : "Speak"}
             >
               <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
             </button>

             <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder={isListening ? "Listening..." : "Ask me anything..."}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                disabled={isListening}
             />
             
             <button 
               onClick={() => handleSend(input)}
               disabled={!input.trim() || isListening}
               className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
             >
               <i className="fa-solid fa-paper-plane"></i>
             </button>
          </div>
        </div>
      )}

      {!embedded && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`shadow-2xl flex items-center justify-center transition-all duration-300 ${
              isOpen 
              ? 'w-12 h-12 rounded-full bg-slate-600 text-white hover:bg-slate-700 rotate-90' 
              : 'w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 text-white hover:scale-110'
          }`}
        >
          {isOpen ? (
              <i className="fa-solid fa-times text-xl"></i>
          ) : (
              <div className="relative">
                  <i className="fa-solid fa-robot text-2xl"></i>
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
              </div>
          )}
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;