import React, { useEffect, useState } from 'react';
import { getTickets } from '../services/dbService';
import { Ticket } from '../types';
import IssueCard from '../components/IssueCard';

interface DashboardProps {
  onNavigate: (page: string, id?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Refresh tickets every few seconds to show auto-escalation
    const load = () => setTickets(getTickets());
    load();
    const interval = setInterval(load, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Community Issues</h1>
          <p className="text-slate-500 mt-1">Real-time civic tracking & reporting</p>
        </div>
        <button
          onClick={() => onNavigate('report')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/20 font-medium transition-all flex items-center gap-2 transform active:scale-95"
        >
          <i className="fa-solid fa-plus"></i> Report Issue
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <i className="fa-solid fa-clipboard-check text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-slate-900">All clear!</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">No active issues reported in your area. Be the first to report something.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <IssueCard 
              key={ticket.id} 
              ticket={ticket} 
              onClick={() => onNavigate('ticket', ticket.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;