import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddProperty from '../components/AddProperty';
import { Building2, Home, LogOut, ClipboardList, Check, X, Send, TrendingUp, Zap, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { generateLeasePDF } from '../utils/generateLeasePDF';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');
  const [replyMessage, setReplyMessage] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || user.role !== 'owner') {
      navigate('/login');
    } else {
      setUserInfo(user);
      fetchMyProperties(user.token);
      fetchMyBookings(user.token);
    }
  }, [navigate]);

  const fetchMyProperties = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/properties/my', config);
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties', error);
    }
  };

  const fetchMyBookings = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/bookings/owner', config);
      setBookings(data);

      // Join a socket room for each booking to listen for updates
      data.forEach(booking => {
        socket.emit('join_room', booking._id);
      });
    } catch (error) {
      console.error('Error fetching bookings', error);
    }
  };

  useEffect(() => {
    // Listen for real-time messages
    socket.on('receive_message', (updatedBooking) => {
      setBookings((prevBookings) => 
        prevBookings.map((b) => (b._id === updatedBooking._id ? updatedBooking : b))
      );
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      await axios.put(`/api/bookings/${bookingId}/status`, { status }, config);
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status } : b));
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleSendMessage = async (bookingId) => {
    if(!replyMessage[bookingId]) return;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      const { data } = await axios.post(`/api/bookings/${bookingId}/message`, { message: replyMessage[bookingId] }, config);
      setBookings(bookings.map(b => b._id === bookingId ? data : b));
      setReplyMessage({...replyMessage, [bookingId]: ''});
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handlePropertyAdded = (newProperty) => {
    setProperties([...properties, newProperty]);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  if (!userInfo) return null;

  return (
    <div className="flex-1 bg-slate-900 flex">
      <aside className="w-64 bg-slate-900 shadow-xl hidden md:flex flex-col border-r border-white/5">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">Room<span className="text-indigo-400">Ease</span></span>
          </Link>
          <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Owner Portal</div>
        </div>
        <div className="p-6 flex-1">
          <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Dashboard</p>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('properties')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'properties' ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Home size={20} /> My Properties
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors justify-between ${activeTab === 'requests' ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <div className="flex items-center gap-3"><ClipboardList size={20} /> Requests</div>
                {bookings.filter(b => b.status === 'Pending').length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{bookings.filter(b => b.status === 'Pending').length}</span>
                )}
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
          <h2 className="text-3xl font-bold text-white">Welcome back, {userInfo.name}!</h2>
        </header>

        {activeTab === 'properties' ? (
          <div className="flex flex-col gap-8">
            {/* AI Market Insights Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              <div className="bg-gradient-to-br from-indigo-600/90 to-purple-700/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-lg border border-indigo-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <TrendingUp size={80} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={20} className="text-purple-200" />
                  <h3 className="font-bold text-purple-100">AI Market Insights</h3>
                </div>
                <h2 className="text-3xl font-extrabold mb-1">High Demand</h2>
                <p className="text-indigo-100 text-sm max-w-[80%]">
                  Searches in your properties' areas have increased by 24% this week. It is a great time to list new rooms.
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/90 to-teal-600/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-lg border border-emerald-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Zap size={80} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={20} className="text-teal-100" />
                  <h3 className="font-bold text-teal-100">Smart Pricing Suggestion</h3>
                </div>
                <h2 className="text-3xl font-extrabold mb-1">+ ₹1,000 /mo</h2>
                <p className="text-teal-50 text-sm max-w-[80%]">
                  Based on current market algorithms, you could increase rent on 2 of your properties without losing occupancy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4 border-b pb-2 border-white/10">Your Active Listings</h3>
              {properties.length === 0 ? (
                <div className="bg-slate-800/50 p-8 rounded-2xl shadow-sm border border-white/5 text-center text-slate-400 backdrop-blur-sm">No properties yet.</div>
              ) : (
                <div className="space-y-4">
                  {properties.map((prop) => (
                    <div key={prop._id} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/5 hover:border-white/10 transition-all flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-bold text-white">{prop.title}</h4>
                        <p className="text-slate-400 text-sm">{prop.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-indigo-400">₹{prop.rent}<span className="text-sm text-slate-500 font-normal">/mo</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
              <div>
                 <AddProperty onPropertyAdded={handlePropertyAdded} />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 border-b pb-2 border-white/10">Incoming Booking Requests</h3>
            {bookings.length === 0 ? (
              <div className="bg-slate-800/50 p-8 rounded-2xl shadow-sm border border-white/5 text-center text-slate-400 backdrop-blur-sm">No requests yet.</div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${booking.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : booking.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>{booking.status}</span>
                          {booking.paymentStatus === 'Paid' && (
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Deposit Paid
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-white">{booking.tenant?.name} requests to book <span className="text-indigo-400">{booking.property?.title}</span></h4>
                      </div>
                      {booking.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateStatus(booking._id, 'Approved')} className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-lg font-medium transition-colors border border-emerald-500/20 hover:border-emerald-500"><Check size={16}/> Approve</button>
                          <button onClick={() => handleUpdateStatus(booking._id, 'Rejected')} className="flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg font-medium transition-colors border border-red-500/20 hover:border-red-500"><X size={16}/> Reject</button>
                        </div>
                      )}

                      {booking.paymentStatus === 'Paid' && (
                        <button 
                          onClick={() => generateLeasePDF(booking)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-colors flex items-center gap-2"
                        >
                          <FileText size={16} /> Download Lease
                        </button>
                      )}
                    </div>

                    {/* Chat Thread */}
                    <div className="bg-slate-900/50 rounded-xl p-4 mb-4 max-h-64 overflow-y-auto space-y-3 border border-white/5">
                      {booking.conversation?.map((msg, index) => (
                        <div key={index} className={`flex flex-col ${msg.sender?._id === userInfo._id ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.sender?._id === userInfo._id ? 'bg-indigo-600 text-white rounded-br-none shadow-md' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-sm'}`}>
                            {msg.message}
                          </div>
                          <span className="text-xs text-slate-500 mt-1">{new Date(msg.createdAt).toLocaleTimeString()} - {msg.sender?.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Reply Box */}
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        aria-label="Type a reply to the tenant"
                        value={replyMessage[booking._id] || ''} 
                        onChange={(e) => setReplyMessage({...replyMessage, [booking._id]: e.target.value})}
                        placeholder="Type a reply..."
                        className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 text-sm transition-colors"
                      />
                      <button onClick={() => handleSendMessage(booking._id)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center shadow-md">
                        <Send size={18} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;
