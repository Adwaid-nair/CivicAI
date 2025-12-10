import React, { useState, useRef } from 'react';
import { analyzeIssueImage, draftComplaint } from '../services/geminiService';
import { saveTicket } from '../services/dbService';
import { Ticket, IssueStatus, Severity, Coordinates } from '../types';
import { AUTHORITIES } from '../constants';
import ChatAssistant from '../components/ChatAssistant';

interface ReportIssueProps {
  onNavigate: (page: string, id?: string) => void;
}

const ReportIssue: React.FC<ReportIssueProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'review'>('capture');
  const [image, setImage] = useState<string | null>(null);
  const [audioTranscript, setAudioTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  
  // Robust handling states
  const [addressText, setAddressText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice recognition not supported in this browser environment.");
      return;
    }

    try {
      // @ts-ignore
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = 'en-US'; 
      recognition.continuous = false; // Auto-detect end of speech
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: any) => {
        // Handle interim results for better feedback, but only commit final
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
             setAudioTranscript(prev => {
                 // Smart spacing: add space if prev exists and doesn't end in space
                 const spacer = prev && !prev.endsWith(' ') ? ' ' : '';
                 return prev + spacer + finalTranscript;
             });
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition", e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleReRecord = () => {
    setAudioTranscript("");
    // Short delay to ensure state clears before restarting
    setTimeout(() => {
        startListening();
    }, 50);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        
        // Auto start location fetch & Reverse Geocoding
        if (navigator.geolocation) {
           setAddressText("Fetching location...");
           navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              setLocation({ lat: latitude, lng: longitude });
              
              try {
                // Fetch human-readable address
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                
                if (data && data.display_name) {
                  // Keep address short: first 3 components
                  const parts = data.display_name.split(',');
                  const shortAddress = parts.slice(0, 3).join(', '); 
                  setAddressText(shortAddress);
                } else {
                  setAddressText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                }
              } catch (err) {
                console.error("Geocoding failed", err);
                setAddressText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              }
            },
            (err) => {
              console.error("Location error", err);
              setAddressText("Location unavailable");
            }
          );
        } else {
            setAddressText("Location not supported");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setStep('analyzing');

    try {
      const base64Data = image.split(',')[1];
      const result = await analyzeIssueImage(base64Data, audioTranscript);
      
      // Use the fetched address
      const finalAddress = addressText || "Unknown Location";
      const drafts = await draftComplaint(result, finalAddress);

      setAnalysis({ ...result, drafts, address: finalAddress });
      setStep('review');
    } catch (e) {
      console.error(e);
      alert("AI Analysis failed. Please try again.");
      setStep('capture');
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || !analysis || !image) return;
    setIsSubmitting(true);

    try {
        const auth = AUTHORITIES.find(a => a.type === analysis.authorityType) || AUTHORITIES[0];
        const simpleId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        const newTicket: Ticket = {
          id: simpleId,
          title: analysis.title,
          description: analysis.description,
          imageUrl: image,
          severity: analysis.severity,
          status: IssueStatus.OPEN,
          location: location || { lat: 0, lng: 0 },
          address: analysis.address || addressText,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          votes: 0,
          authorityId: auth.id,
          aiAnalysis: {
            detectedObjects: analysis.detectedObjects,
            confidence: analysis.confidence || 0.95,
            reasoning: analysis.reasoning || "Visual evidence matches standard civic issue patterns."
          },
          drafts: analysis.drafts,
          timeline: [
            {
              timestamp: Date.now(),
              title: "Ticket Created",
              description: "Issue reported by citizen.",
              icon: "fa-plus-circle"
            },
            {
              timestamp: Date.now() + 1000,
              title: "AI Analysis Complete",
              description: `Severity rated as ${analysis.severity}. Routed to ${auth.name}.`,
              icon: "fa-robot"
            }
          ]
        };

        await new Promise(resolve => setTimeout(resolve, 500));
        saveTicket(newTicket);
        onNavigate('dashboard');
    } catch (error) {
        console.error("Submission failed", error);
        alert("Failed to create ticket. Please try again.");
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {step === 'capture' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Report an Issue</h2>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            {image ? (
              <div className="relative rounded-xl overflow-hidden mb-4">
                <img src={image} alt="Preview" className="w-full h-64 object-cover" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                   <i className="fa-solid fa-location-dot"></i> {addressText}
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl h-64 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <i className="fa-solid fa-camera text-4xl mb-2"></i>
                <span className="font-medium">Tap to take photo or upload</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between items-center">
                  <span>Voice Note / Description</span>
                  <span className="text-xs text-slate-400">Add details for better AI analysis</span>
              </label>
              <div className="relative">
                <textarea 
                  value={audioTranscript}
                  onChange={(e) => setAudioTranscript(e.target.value)}
                  className="w-full p-4 pr-12 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder-slate-400 text-base resize-y min-h-[120px]"
                  placeholder="Describe the issue or tap the mic to speak..."
                  rows={4}
                />
                
                {/* Voice & Assistant Controls */}
                <div className="absolute right-2 top-2 flex gap-1">
                    {/* Clear Text Button */}
                    {audioTranscript && !isListening && (
                        <button
                            type="button"
                            onClick={() => setAudioTranscript('')}
                            className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Clear text"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    )}

                    {/* AI Helper Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAssistant(!showAssistant)}
                        className={`p-2 rounded-full transition-colors ${showAssistant ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 hover:bg-blue-50'}`}
                        title="AI Assistant"
                    >
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </button>

                    {/* Mic Toggle Button */}
                    <button 
                        type="button"
                        onClick={toggleListening}
                        className={`p-2 rounded-full transition-all border ${isListening ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'}`}
                        title={isListening ? "Stop Listening" : "Start Voice Input"}
                    >
                        <i className={`fa-solid ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
                    </button>
                </div>
                
                {/* Listening Status Indicator */}
                {isListening && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-xs font-medium text-red-500">Listening... Speak now</span>
                    </div>
                )}
              </div>
              
              {/* Embedded Assistant */}
              {showAssistant && (
                <div className="animate-fadeIn">
                    <ChatAssistant 
                        embedded 
                        onClose={() => setShowAssistant(false)}
                        onApplyContent={(text) => setAudioTranscript(text)}
                        systemInstruction="You are an expert at describing civic issues (potholes, garbage, lights, etc.). Help the user write a detailed description for their report. Ask for specific details like location markers, size of damage, or potential hazards to public safety. If the user asks for a description, provide a clear, concise paragraph they can use directly."
                        initialMessage="I can help you describe the issue. Tell me what you see, and I'll help you phrase it for the authorities."
                    />
                </div>
              )}
            </div>

            <button 
              type="button"
              disabled={!image}
              onClick={handleAnalyze}
              className="w-full mt-6 bg-blue-600 disabled:bg-slate-300 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
            >
              Analyze Issue
            </button>
          </div>
        </div>
      )}

      {step === 'analyzing' && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-bold text-slate-900">AI is analyzing the scene...</h2>
          <p className="text-slate-500 mt-2">Detecting objects, scoring severity, and selecting authorities.</p>
        </div>
      )}

      {step === 'review' && analysis && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{analysis.title}</h2>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                   <i className="fa-solid fa-map-pin text-slate-400"></i> {analysis.address}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${analysis.severity === Severity.HIGH || analysis.severity === Severity.EMERGENCY ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                {analysis.severity}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Detection</h4>
                <p className="text-slate-800 text-sm">{analysis.description}</p>
                <div className="flex gap-2 mt-2">
                  {analysis.detectedObjects.map((obj: string, i: number) => (
                    <span key={i} className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">{obj}</span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Recommended Authority</h4>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                    <i className="fa-solid fa-building-columns"></i>
                  </div>
                  <span className="font-semibold text-blue-900">{analysis.authorityType}</span>
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-bold shadow-lg transition-all flex justify-center items-center gap-2 ${
                  isSubmitting 
                  ? 'bg-emerald-700 text-emerald-100 cursor-wait' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
               {isSubmitting ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Processing...
                 </>
               ) : (
                 <>
                   <i className="fa-solid fa-check"></i> Confirm & Submit Report
                 </>
               )}
            </button>
            <button 
              type="button"
              onClick={() => setStep('capture')}
              disabled={isSubmitting}
              className="w-full mt-3 text-slate-500 font-medium py-2 hover:text-slate-800"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;