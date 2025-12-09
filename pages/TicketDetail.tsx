import React, { useEffect, useState } from 'react';
import { getTicketById, voteTicket, addTimelineEvent } from '../services/dbService';
import { getCommissionerResponse } from '../services/geminiService';
import { Ticket, IssueStatus } from '../types';
import { AUTHORITIES } from '../constants';

interface TicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, onBack }) => {
  const [ticket, setTicket] = useState<Ticket | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketId) {
        setLoading(false);
        return;
    }

    const t = getTicketById(ticketId);
    setTicket(t);
    setLoading(false);

    // Simulate "Commissioner" responding if not already responded
    if (t && !t.commissionerResponse) {
      getCommissionerResponse(t).then(response => {
        if (response) {
            // Very hacky update to DB for simulation
            t.commissionerResponse = response;
            addTimelineEvent(t.id, {
                timestamp: Date.now(),
                title: "Official Response",
                description: "Virtual Commissioner has acknowledged the ticket.",
                icon: "fa-user-tie"
            });
            setTicket({...t}); // Force re-render
        }
      });
    }
  }, [ticketId]);

  const handleVote = () => {
    voteTicket(ticketId);
    setTicket(getTicketById(ticketId)); // Refresh
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500">Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <i className="fa-solid fa-ticket-simple-slash text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ticket Not Found</h2>
        <p className="text-slate-500 mb-8">The ticket ID <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{ticketId || 'Unknown'}</span> does not exist or has been removed.</p>
        <button 
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
        </button>
      </div>
    );
  }

  const authority = AUTHORITIES.find(a => a.id === ticket.authorityId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={onBack} className="mb-4 text-slate-500 hover:text-slate-800 flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
            <i className="fa-solid fa-arrow-left text-sm"></i>
        </div>
        <span className="font-medium">Back to Dashboard</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="relative h-64 sm:h-80 bg-slate-100">
               <img src={ticket.imageUrl} alt="Issue" className="w-full h-full object-cover" />
               <div className="absolute top-4 left-4">
                  <span className="bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-mono border border-white/20 shadow-lg">
                    Ticket #{ticket.id}
                  </span>
               </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                 <div>
                   <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2">{ticket.title}</h1>
                   <div className="flex items-center gap-2 text-sm text-slate-500">
                     <i className="fa-solid fa-location-dot text-slate-400"></i>
                     <span>{ticket.address || 'Location Unknown'}</span>
                   </div>
                 </div>
                 <span className={`self-start px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap border ${ticket.status === IssueStatus.RESOLVED ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {ticket.status}
                  </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                <p className="text-slate-700 leading-relaxed">{ticket.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleVote}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  <i className="fa-solid fa-thumbs-up"></i>
                  <span className="font-bold">{ticket.votes}</span> Support
                </button>
                <a 
                  href={`https://wa.me/${authority?.whatsapp}?text=${encodeURIComponent(ticket.drafts?.whatsappMessage || '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/20 font-medium"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i> Official Report
                </a>
                <a 
                  href={`mailto:${authority?.email}?subject=${encodeURIComponent(ticket.drafts?.emailSubject || '')}&body=${encodeURIComponent(ticket.drafts?.emailBody || '')}`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200 font-medium"
                >
                  <i className="fa-regular fa-envelope text-lg"></i> Email
                </a>
              </div>
            </div>
          </div>

          {/* AI Commissioner Chat Bubble */}
          {ticket.commissionerResponse && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl flex gap-4 items-start shadow-sm">
               <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ring-4 ring-blue-50">
                 <i className="fa-solid fa-user-tie text-xl"></i>
               </div>
               <div>
                 <h3 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                    Virtual Commissioner 
                    <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded uppercase">AI Agent</span>
                 </h3>
                 <div className="relative">
                    <i className="fa-solid fa-quote-left absolute -left-2 -top-1 text-blue-200 text-xs"></i>
                    <p className="text-blue-800 text-sm italic pl-2 leading-relaxed">{ticket.commissionerResponse}</p>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Right Column: Timeline & Meta */}
        <div className="space-y-6">
          {/* AI Intelligence Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center text-xs">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              AI Analysis
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-500 font-medium">Confidence Score</span>
                  <span className="font-bold text-slate-900">{Math.round((ticket.aiAnalysis?.confidence || 0) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                        (ticket.aiAnalysis?.confidence || 0) > 0.8 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${(ticket.aiAnalysis?.confidence || 0) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">AI Reasoning</span>
                 <p className="text-sm text-slate-600 italic leading-relaxed">
                   "{ticket.aiAnalysis?.reasoning || 'No reasoning provided.'}"
                 </p>
              </div>

              <div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Detected Objects</span>
                 <div className="flex flex-wrap gap-2">
                   {ticket.aiAnalysis?.detectedObjects.map((obj, i) => (
                     <span key={i} className="px-2.5 py-1 bg-white text-slate-600 text-xs font-medium rounded-md border border-slate-200 shadow-sm">
                       {obj}
                     </span>
                   ))}
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Tracking Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-slate-200">
              {ticket.timeline.map((event, i) => (
                <div key={i} className="relative pl-8 group">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 bg-white ${i === 0 ? 'border-blue-500 text-blue-500' : 'border-slate-300 text-slate-300'}`}>
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                  </div>
                  <h4 className={`text-sm font-bold ${i === 0 ? 'text-blue-700' : 'text-slate-700'}`}>{event.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{event.description}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-building-columns text-slate-400"></i> Authority Info
            </h3>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
              <p className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Name</span> 
                  <span className="font-medium text-slate-900 text-right">{authority?.name}</span>
              </p>
              <p className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Type</span> 
                  <span className="font-medium text-slate-900">{authority?.type}</span>
              </p>
              <p className="flex justify-between pt-1">
                  <span className="text-slate-500">Email</span> 
                  <a href={`mailto:${authority?.email}`} className="font-medium text-blue-600 truncate max-w-[150px]">{authority?.email}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;