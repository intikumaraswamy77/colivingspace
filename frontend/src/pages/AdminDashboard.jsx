import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Users, Building2, ClipboardList, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      setUserInfo(user);
      fetchData(user.token);
    }
  }, [navigate]);

  const fetchData = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [usersRes, propertiesRes, bookingsRes] = await Promise.all([
        axios.get('/api/auth/users', config),
        axios.get('/api/properties/admin/all', config),
        axios.get('/api/bookings/admin/all', config)
      ]);
      setUsers(usersRes.data);
      setProperties(propertiesRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/', { replace: true });
  };

  if (!userInfo) return null;

  return (
    <div className="flex-1 bg-slate-900 flex">
      <aside className="w-64 bg-slate-900 text-white shadow-xl hidden md:flex flex-col border-r border-white/5">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">Room<span className="text-indigo-400">Ease</span></span>
          </Link>
          <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
            <ShieldCheck size={14}/> Admin Portal
          </div>
        </div>
        <div className="p-6 flex-1">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
                <Users size={20} /> All Users
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('properties')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'properties' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
                <Building2 size={20} /> All Properties
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
                <ClipboardList size={20} /> All Bookings
              </button>
            </li>
          </ul>
        </div>
        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl font-medium transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white">Platform Overview</h2>
          <div className="flex gap-4 mt-6">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/5 flex-1 transition-all hover:border-white/10">
              <p className="text-sm font-semibold text-slate-400 uppercase">Total Users</p>
              <p className="text-3xl font-bold text-indigo-400 mt-2">{users.length}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/5 flex-1 transition-all hover:border-white/10">
              <p className="text-sm font-semibold text-slate-400 uppercase">Total Properties</p>
              <p className="text-3xl font-bold text-indigo-400 mt-2">{properties.length}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/5 flex-1 transition-all hover:border-white/10">
              <p className="text-sm font-semibold text-slate-400 uppercase">Total Bookings</p>
              <p className="text-3xl font-bold text-indigo-400 mt-2">{bookings.length}</p>
            </div>
          </div>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-white/5 overflow-hidden">
          {activeTab === 'users' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-white/5">
                  <th className="p-4 font-semibold text-slate-300">Name</th>
                  <th className="p-4 font-semibold text-slate-300">Email</th>
                  <th className="p-4 font-semibold text-slate-300">Role</th>
                  <th className="p-4 font-semibold text-slate-300">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-white/5 hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-white">{u.name}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : u.role === 'owner' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'properties' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-white/5">
                  <th className="p-4 font-semibold text-slate-300">Title</th>
                  <th className="p-4 font-semibold text-slate-300">Location</th>
                  <th className="p-4 font-semibold text-slate-300">Rent</th>
                  <th className="p-4 font-semibold text-slate-300">Owner</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <tr key={p._id} className="border-b border-white/5 hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-white">{p.title}</td>
                    <td className="p-4 text-slate-400">{p.location}</td>
                    <td className="p-4 font-bold text-indigo-400">₹{p.rent}</td>
                    <td className="p-4 text-slate-400">{p.owner?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'bookings' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-white/5">
                  <th className="p-4 font-semibold text-slate-300">Property</th>
                  <th className="p-4 font-semibold text-slate-300">Tenant</th>
                  <th className="p-4 font-semibold text-slate-300">Owner</th>
                  <th className="p-4 font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id} className="border-b border-white/5 hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-white">{b.property?.title}</td>
                    <td className="p-4 text-slate-400">{b.tenant?.name}</td>
                    <td className="p-4 text-slate-400">{b.owner?.name}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : b.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
