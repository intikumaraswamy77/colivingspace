import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LogIn, User, Lock, Mail, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const isPortal = location.pathname.includes('/portal');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      if (userInfo.role === 'admin') {
        navigate('/portal/admin-dashboard', { replace: true });
      } else if (userInfo.role === 'owner') {
        navigate('/portal/owner-dashboard', { replace: true });
      } else {
        navigate('/explore', { replace: true });
      }
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/auth/login', { email, password }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.role === 'admin') {
        navigate('/portal/admin-dashboard', { replace: true });
      } else if (data.role === 'owner') {
        navigate('/portal/owner-dashboard', { replace: true });
      } else {
        navigate('/tenant-dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      {/* Back to Home Button */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors z-10">
        <ArrowLeft size={20} /> Back to Home
      </Link>
      
      <div className="max-w-md w-full space-y-8 relative z-10 bg-slate-900/90 backdrop-blur-xl p-10 rounded-3xl border border-white/5 shadow-2xl transition-all">
        <div>
          <div className="mx-auto h-12 w-12 bg-indigo-500/20 flex items-center justify-center rounded-2xl border border-indigo-500/30">
            <LogIn className="h-6 w-6 text-indigo-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Or{' '}
            <Link to={isPortal ? '/portal/register' : '/register'} className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              start your free account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm text-center">{error}</div>}
          
          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => { setEmail('tenant@test.com'); setPassword('123456'); }}
              className="flex-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 py-2 rounded-xl text-xs font-bold transition-colors border border-indigo-500/20 uppercase tracking-wider"
            >
              Demo Tenant
            </button>
            <button
              type="button"
              onClick={() => { setEmail('owner@test.com'); setPassword('123456'); }}
              className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 py-2 rounded-xl text-xs font-bold transition-colors border border-purple-500/20 uppercase tracking-wider"
            >
              Demo Owner
            </button>
          </div>

          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                aria-label="Email address"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 bg-slate-800/50 border border-slate-700 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-label="Password"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 bg-slate-800/50 border border-slate-700 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-slate-700 bg-slate-800 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
