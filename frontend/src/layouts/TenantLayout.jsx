import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const TenantLayout = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {userInfo && userInfo.role === 'tenant' && (
        <nav className="bg-slate-900/80 backdrop-blur-xl p-4 flex justify-between items-center px-8 z-50 relative border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">Room<span className="text-indigo-400">Ease</span></span>
          </Link>
          <div className="space-x-6 flex items-center">
            <Link to="/explore" className="text-slate-300 font-medium hover:text-white transition-colors">Find a Room</Link>
            <Link to="/find-roommates" className="text-slate-300 font-medium hover:text-white transition-colors">Find Roommates</Link>
            
            <div className="flex items-center gap-4">
              <Link to="/tenant-dashboard" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                My Dashboard
              </Link>
              <button onClick={handleLogout} className="text-red-400 font-medium hover:text-red-300 transition-colors">
                Log Out
              </button>
            </div>
          </div>
        </nav>
      )}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default TenantLayout;
