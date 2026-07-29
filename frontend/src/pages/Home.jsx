import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Home as HomeIcon, Building2, UserPlus, LogIn, Sparkles, Map, FileText, Bot, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  if (userInfo?.role === 'tenant') {
    return <Navigate to="/explore" replace />;
  } else if (userInfo?.role === 'owner') {
    return <Navigate to="/portal/owner-dashboard" replace />;
  } else if (userInfo?.role === 'admin') {
    return <Navigate to="/portal/admin-dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Room<span className="text-indigo-400">Ease</span></span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium mb-8">
            <Sparkles size={16} />
            <span>The Future of Co-Living is Here</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Accommodation</span> Discovery
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed mb-10 max-w-3xl mx-auto">
            The platform simplifies accommodation discovery while helping property owners efficiently manage shared living spaces. Powered by smart matchmaking and automated e-leases.
          </p>
        </div>

        {/* Portals Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          
          {/* Tenant Portal */}
          <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-blue-500/50 to-blue-500/10 hover:from-blue-400 hover:to-blue-600 transition-all duration-500">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            <div className="relative h-full bg-slate-900/90 backdrop-blur-xl p-10 rounded-3xl border border-white/5 flex flex-col">
              <div className="h-16 w-16 bg-blue-500/20 flex items-center justify-center rounded-2xl mb-8 border border-blue-500/30">
                <HomeIcon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Find Your Home</h3>
              <p className="text-slate-400 mb-8 flex-1 leading-relaxed">
                Log in as a Student or Professional to explore properties with interactive maps, get smartly matched with compatible roommates, and digitally sign leases.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Link to="/login" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  <LogIn size={20} /> Login
                </Link>
                <Link to="/register" className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-4 px-6 rounded-xl transition-colors flex justify-center items-center gap-2 border border-slate-700 hover:border-slate-600">
                  <UserPlus size={20} /> Register
                </Link>
              </div>
            </div>
          </div>

          {/* Owner Portal */}
          <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-purple-500/50 to-purple-500/10 hover:from-purple-400 hover:to-purple-600 transition-all duration-500">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            <div className="relative h-full bg-slate-900/90 backdrop-blur-xl p-10 rounded-3xl border border-white/5 flex flex-col">
              <div className="h-16 w-16 bg-purple-500/20 flex items-center justify-center rounded-2xl mb-8 border border-purple-500/30">
                <Building2 className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Manage Properties</h3>
              <p className="text-slate-400 mb-8 flex-1 leading-relaxed">
                Log in as an Owner to list properties, manage booking requests, receive simulated payments, and leverage Market Insights to maximize ROI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Link to="/portal/login" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  <LogIn size={20} /> Login
                </Link>
                <Link to="/portal/register" className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-4 px-6 rounded-xl transition-colors flex justify-center items-center gap-2 border border-slate-700 hover:border-slate-600">
                  <UserPlus size={20} /> Register
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="pt-20 border-t border-slate-800/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powered by Next-Gen Tech</h2>
            <p className="text-slate-400">Everything you need for modern co-living, built into one platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Bot className="text-pink-400" size={32}/>, title: 'Smart Matchmaking', desc: 'Find the perfect roommates based on lifestyle, habits, and budget analysis.' },
              { icon: <Map className="text-sky-400" size={32}/>, title: 'Interactive Maps', desc: 'Explore neighborhoods and properties with our responsive map discovery.' },
              { icon: <ShieldCheck className="text-emerald-400" size={32}/>, title: 'Verified Trust', desc: 'Secure simulated payments and verified owner profiles ensure safety.' },
              { icon: <FileText className="text-amber-400" size={32}/>, title: 'Auto E-Leases', desc: 'Generate legally formatted, digitally signed PDF leases instantly.' },
            ].map((feat, i) => (
              <div key={i} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/50 transition-colors">
                <div className="mb-4 bg-slate-800 inline-block p-3 rounded-xl border border-slate-700">{feat.icon}</div>
                <h4 className="text-white font-bold text-lg mb-2">{feat.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
