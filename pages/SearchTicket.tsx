import React, { useState, useEffect } from 'react';
import { getTickets } from '../services/dbService';
import { Ticket } from '../types';
import IssueCard from '../components/IssueCard';

interface SearchTicketProps {
  onNavigate: (page: string, id?: string) => void;
}

const SearchTicket: React.FC<SearchTicketProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const filtered = tickets.filter(t => {
    const q = query.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) || 
      t.id.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => onNavigate('dashboard')} className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
            <i className="fa-solid fa-arrow-left text-sm"></i>
        </div>
        <span className="font-medium">Back to Dashboard</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Track Your Issue</h1>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto">Enter your Ticket Number (e.g., 4521) or search by keywords to check the status of your reported complaints.</p>
        
        <div className="max-w-xl mx-auto relative group">
          <input
            type="text"
            placeholder="Search Ticket No (e.g. 4521) or keywords..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <i className="fa-solid fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-blue-500 transition-colors"></i>
        </div>
      </div>

      {query && (
        <div className="mb-6 flex items-center justify-between">
            <span className="text-slate-500 text-sm font-medium">Found {filtered.length} result{filtered.length !== 1 && 's'}</span>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(ticket => (
          <IssueCard 
            key={ticket.id} 
            ticket={ticket} 
            onClick={() => onNavigate('ticket', ticket.id)} 
          />
        ))}
      </div>
      
      {/* Empty States */}
      {filtered.length === 0 && query && (
         <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <i className="fa-solid fa-magnifying-glass text-3xl text-slate-300"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No tickets found</h3>
            <p className="text-slate-500 mt-1">We couldn't find any issues matching "{query}".</p>
            <button 
              onClick={() => setQuery('')}
              className="mt-4 text-blue-600 font-medium hover:text-blue-800"
            >
              Clear Search
            </button>
         </div>
      )}

      {!query && tickets.length > 0 && (
         <div className="text-center py-12">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <i className="fa-solid fa-clock-rotate-left"></i>
              Recent community reports will appear here as you type.
            </p>
         </div>
      )}
    </div>
  );
};

export default SearchTicket;