import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, UserCircle } from 'lucide-react';

const TenantLayout = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/', { replace: true });
  };

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
                <Link to="/explore" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Explore</Link>
                <Link to="/find-roommates" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Roommates</Link>
                <Link to="/messages" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Messages</Link>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors border border-white/10 hover:border-white/20">
                  <UserCircle size={18} /> Profile
                </Link>
                <button onClick={handleLogout} className="text-red-400 font-medium hover:text-red-300 transition-colors ml-2">
                  Log Out
                </button>
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
