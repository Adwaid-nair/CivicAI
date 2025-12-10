import React, { useState, useRef, useEffect } from 'react';
import { analyzeIssueImage, draftComplaint } from '../services/geminiService';
import { saveTicket } from '../services/dbService';
import { Ticket, IssueStatus, Severity, Coordinates } from '../types';
import { AUTHORITIES } from '../constants';
import ChatAssistant from '../components/ChatAssistant';

// Declare Leaflet global
declare const L: any;

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
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>(Severity.MEDIUM);
  
  // Robust handling states
  const [addressText, setAddressText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location Picker States
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [isLocationManuallySet, setIsLocationManuallySet] = useState(false);
  const pickerMapRef = useRef<any>(null);
  const pickerMarkerRef = useRef<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Map Picker when modal opens
  useEffect(() => {
    if (showMapPicker && !pickerMapRef.current) {
        // Delay slightly to ensure DOM element exists
        setTimeout(() => {
            const defaultLat = location?.lat || 12.9716;
            const defaultLng = location?.lng || 77.5946;

            const map = L.map('picker-map').setView([defaultLat, defaultLng], 18);
            
            // 1. Satellite View (Esri World Imagery) - Base
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri',
                maxZoom: 19
            }).addTo(map);

            // 2. Roads & Transportation Overlay - Highlights roads
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
                minZoom: 0,
                maxZoom: 19
            }).addTo(map);

            // 3. Labels Overlay - City/Street names
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
                minZoom: 0,
                maxZoom: 19
            }).addTo(map);

            // Custom Blue Pin Marker
            const customIcon = L.divIcon({
                className: 'custom-map-marker bg-transparent border-0',
                html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2" style="filter: drop-shadow(0 4px 3px rgba(0,0,0,0.4)); width: 48px; height: 48px; display: block;">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                `,
                iconSize: [48, 48],
                iconAnchor: [24, 48], // Tip of the pin
                popupAnchor: [0, -48]
            });

            const marker = L.marker([defaultLat, defaultLng], {
                draggable: true,
                icon: customIcon
            }).addTo(map);

            marker.on('dragend', function(event: any) {
                const marker = event.target;
                const position = marker.getLatLng();
                marker.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
                map.panTo(new L.LatLng(position.lat, position.lng));
            });
            
            // Map click to move marker
            map.on('click', (e: any) => {
                marker.setLatLng(e.latlng);
                map.panTo(e.latlng);
            });

            pickerMapRef.current = map;
            pickerMarkerRef.current = marker;
            
            // If we don't have a location yet, try to find it once map opens
            if (!location && navigator.geolocation) {
               handleLocateMe();
            }
        }, 100);
    }
    
    // Cleanup
    return () => {
        if (!showMapPicker && pickerMapRef.current) {
            pickerMapRef.current.remove();
            pickerMapRef.current = null;
            pickerMarkerRef.current = null;
        }
    };
  }, [showMapPicker]);

  const handleLocateMe = () => {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition((pos) => {
             const { latitude, longitude } = pos.coords;
             if (pickerMapRef.current && pickerMarkerRef.current) {
                 const newLatLng = new L.LatLng(latitude, longitude);
                 pickerMarkerRef.current.setLatLng(newLatLng);
                 pickerMapRef.current.setView(newLatLng, 18);
             }
         }, (err) => {
             alert("Could not access your location. Please check permissions.");
         });
     } else {
         alert("Geolocation is not supported by your browser.");
     }
  };

  const confirmLocation = async () => {
      if (pickerMarkerRef.current) {
          const { lat, lng } = pickerMarkerRef.current.getLatLng();
          setLocation({ lat, lng });
          setIsLocationManuallySet(true);
          
          // Reverse Geocode the manually selected location
          try {
             setAddressText("Fetching address...");
             const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
             const data = await response.json();
             if (data && data.display_name) {
                  const parts = data.display_name.split(',');
                  const shortAddress = parts.slice(0, 3).join(', '); 
                  setAddressText(shortAddress);
             } else {
                  setAddressText(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
             }
          } catch (e) {
             setAddressText(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          }
          
          setShowMapPicker(false);
      }
  };

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
        
        // Only auto-fetch if user hasn't manually set it
        if (!isLocationManuallySet && navigator.geolocation) {
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
        } else if (!isLocationManuallySet) {
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
      setSelectedSeverity(result.severity); // Initialize with AI recommendation
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
          severity: selectedSeverity, // Use user-selected severity
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
            reasoning: analysis.reasoning || "Visual evidence matches standard civic issue patterns.",
            detectedSeverity: analysis.severity // Persist original AI detection
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
              description: `Severity rated as ${selectedSeverity}. Routed to ${auth.name}.`,
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
    <div className="max-w-2xl mx-auto px-4 py-8 relative">
      {/* Map Picker Modal */}
      {showMapPicker && (
        <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-fadeIn">
            <div className="px-4 py-3 border-b flex justify-between items-center bg-white shadow-sm z-10">
                <div>
                   <h3 className="font-bold text-slate-900">Mark Exact Location</h3>
                   <p className="text-xs text-slate-500">Drag marker to the issue spot</p>
                </div>
                <button 
                    onClick={() => setShowMapPicker(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                    <i className="fa-solid fa-times"></i>
                </button>
            </div>
            
            <div className="flex-1 relative">
                <div id="picker-map" className="absolute inset-0 bg-slate-100"></div>
                
                <button
                    onClick={handleLocateMe}
                    className="absolute bottom-6 right-4 z-[500] bg-white text-blue-600 p-3 rounded-full shadow-lg border border-slate-200 hover:bg-blue-50 transition-colors"
                    title="Find My Location"
                >
                    <i className="fa-solid fa-crosshairs text-lg"></i>
                </button>
            </div>
            
            <div className="p-4 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button 
                    onClick={confirmLocation} 
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                    <i className="fa-solid fa-location-dot"></i> Confirm Location
                </button>
            </div>
        </div>
      )}

      {step === 'capture' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Report an Issue</h2>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            {image ? (
              <div className="relative rounded-xl overflow-hidden mb-4 bg-slate-900 group shadow-md">
                <img src={image} alt="Preview" className="w-full h-64 object-contain" />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                {/* Remove Button */}
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-black/40 text-white w-8 h-8 rounded-full hover:bg-red-500 backdrop-blur-md transition-all flex items-center justify-center"
                  title="Remove Image"
                >
                  <i className="fa-solid fa-times"></i>
                </button>

                {/* Location Info & Edit */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/20">
                                <i className="fa-solid fa-location-dot text-xs"></i>
                            </div>
                            <span className="text-sm font-medium truncate opacity-90">{addressText || "Location not set"}</span>
                        </div>
                        <button 
                            onClick={() => setShowMapPicker(true)}
                            className="shrink-0 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-white/30 shadow-sm"
                        >
                            Edit Location
                        </button>
                    </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 flex flex-col h-72 transition-colors hover:border-blue-400 group">
                  <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-[2] flex flex-col items-center justify-center cursor-pointer w-full hover:bg-white/60 transition-colors rounded-t-2xl"
                  >
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-3 text-blue-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          <i className="fa-solid fa-camera text-2xl"></i>
                      </div>
                      <h3 className="font-bold text-slate-700">Tap to upload photo</h3>
                      <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG</p>
                  </div>

                  <div className="relative flex items-center w-full px-6 py-2">
                      <div className="h-px bg-slate-200 flex-1"></div>
                      <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-transparent">OR</span>
                      <div className="h-px bg-slate-200 flex-1"></div>
                  </div>

                  <div className="flex-1 w-full px-6 pb-6 flex items-center">
                       <button
                          type="button"
                          onClick={(e) => {
                              e.stopPropagation();
                              setShowMapPicker(true);
                          }}
                          className="w-full py-3 bg-white border border-blue-200 rounded-xl shadow-sm text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-300 hover:shadow transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                       >
                          <i className="fa-solid fa-map-location-dot"></i> Mark Location on Map
                       </button>
                  </div>
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
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900">{analysis.title}</h2>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                   <i className="fa-solid fa-map-pin text-slate-400"></i> {analysis.address}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Severity Level</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {[Severity.LOW, Severity.MEDIUM, Severity.HIGH, Severity.EMERGENCY].map((sev) => {
                         const isSelected = selectedSeverity === sev;
                         let colorClass = 'text-slate-500 hover:text-slate-700';
                         if (isSelected) {
                            if (sev === Severity.LOW) colorClass = 'bg-green-100 text-green-700 shadow-sm';
                            else if (sev === Severity.MEDIUM) colorClass = 'bg-yellow-100 text-yellow-700 shadow-sm';
                            else if (sev === Severity.HIGH) colorClass = 'bg-orange-100 text-orange-700 shadow-sm';
                            else if (sev === Severity.EMERGENCY) colorClass = 'bg-red-100 text-red-700 shadow-sm';
                         }
                         
                         return (
                            <button
                                key={sev}
                                onClick={() => setSelectedSeverity(sev)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${colorClass}`}
                            >
                                {sev}
                            </button>
                         );
                    })}
                </div>
                {analysis.severity !== selectedSeverity && (
                    <span className="text-[10px] text-slate-400">
                        AI Detected: {analysis.severity}
                    </span>
                )}
              </div>
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