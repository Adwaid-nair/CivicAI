import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import TicketDetail from './pages/TicketDetail';
import Heatmap from './pages/Heatmap';
import SearchTicket from './pages/SearchTicket';
import ChatAssistant from './components/ChatAssistant';

const App: React.FC = () => {
  // Simple Hash Routing Simulation
  const [route, setRoute] = useState<string>('dashboard');
  const [params, setParams] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleHashChange = () => {
      // Robust hash parsing: Remove leading #, then split by /
      const hash = window.location.hash.substring(1); // removes '#'
      // Remove leading slash if present
      const cleanHash = hash.startsWith('/') ? hash.substring(1) : hash;
      
      const parts = cleanHash.split('/').filter(p => p !== ''); // split and remove empty strings
      
      const page = parts[0] || 'dashboard';
      const id = parts[1];
      
      setRoute(page);
      setParams(id);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial load check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string, id?: string) => {
    if (id) {
        window.location.hash = `/${page}/${id}`;
    } else {
        window.location.hash = `/${page}`;
    }
  };

  let content;
  // Route matching
  switch (route) {
    case 'report':
      content = <ReportIssue onNavigate={navigate} />;
      break;
    case 'ticket':
      // Only show TicketDetail if we actually have an ID param
      if (params) {
        content = <TicketDetail ticketId={params} onBack={() => navigate('dashboard')} />;
      } else {
        // If route is /ticket but no ID, go back to dashboard
        content = <Dashboard onNavigate={navigate} />;
      }
      break;
    case 'map':
      content = <Heatmap />;
      break;
    case 'search':
      content = <SearchTicket onNavigate={navigate} />;
      break;
    case 'dashboard':
    default:
      content = <Dashboard onNavigate={navigate} />;
      break;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <Navbar currentPage={route} onNavigate={(page) => navigate(page)} />
      <main className="flex-1">
        {content}
      </main>
      
      {/* Floating AI Assistant */}
      <ChatAssistant />
      
      {/* Disclaimer for Hackathon Judges */}
      <div className="bg-slate-900 text-slate-400 py-4 text-center text-xs">
        <p>CivicAI - Hackathon Demo v1.0 | Simulating Backend with LocalStorage & Gemini 2.5 Flash</p>
      </div>
    </div>
  );
};

export default App;