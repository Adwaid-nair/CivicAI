import React from 'react';
import { Ticket, Severity, IssueStatus } from '../types';

interface IssueCardProps {
  ticket: Ticket;
  onClick: () => void;
}

const severityColor = {
  [Severity.LOW]: 'bg-green-100 text-green-800 border-green-200',
  [Severity.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [Severity.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
  [Severity.EMERGENCY]: 'bg-red-100 text-red-800 border-red-200 animate-pulse',
};

const IssueCard: React.FC<IssueCardProps> = ({ ticket, onClick }) => {
  // Use a simpler logic: if ticket ID is short (<= 8 chars), show full. Otherwise truncate.
  // This handles both the new 4-digit IDs (e.g. "4521") and legacy UUIDs.
  const displayId = ticket.id.length <= 8 ? ticket.id : ticket.id.slice(0, 8) + '...';

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col h-full group"
    >
      <div className="relative h-48 bg-slate-100">
        {ticket.imageUrl ? (
          <img src={ticket.imageUrl} alt={ticket.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <i className="fa-solid fa-image text-3xl"></i>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase border ${severityColor[ticket.severity]}`}>
            {ticket.severity}
          </span>
        </div>
        <div className="absolute top-2 left-2 max-w-[80%]">
          <span className="bg-slate-900/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-mono border border-white/20 inline-block truncate w-full">
            #{displayId}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{ticket.title}</h3>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {ticket.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <i className="fa-solid fa-location-dot"></i>
            <span className="max-w-[100px] truncate">{ticket.address || 'Unknown Location'}</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="flex items-center gap-1 text-slate-600">
              <i className="fa-solid fa-thumbs-up"></i> {ticket.votes}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${ticket.status === IssueStatus.RESOLVED ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {ticket.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;