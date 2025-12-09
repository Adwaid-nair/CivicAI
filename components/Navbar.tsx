import React from 'react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  
  const handleNavClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    onNavigate(page);
  };

  const getLinkClass = (page: string) => {
    const baseClass = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 cursor-pointer";
    if (currentPage === page) {
      return `${baseClass} border-blue-600 text-slate-900`;
    }
    return `${baseClass} border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="#" onClick={(e) => handleNavClick(e, 'dashboard')} className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">CivicAI</span>
            </a>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <a href="#" onClick={(e) => handleNavClick(e, 'dashboard')} className={getLinkClass('dashboard')}>
                Dashboard
              </a>
              <a href="#" onClick={(e) => handleNavClick(e, 'report')} className={getLinkClass('report')}>
                Report Issue
              </a>
              <a href="#" onClick={(e) => handleNavClick(e, 'search')} className={getLinkClass('search')}>
                Ticket Search
              </a>
              <a href="#" onClick={(e) => handleNavClick(e, 'map')} className={getLinkClass('map')}>
                Heatmap
              </a>
            </div>
          </div>
          <div className="flex items-center">
             <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200 animate-pulse">
               <i className="fa-solid fa-satellite-dish mr-1"></i> Live
             </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;