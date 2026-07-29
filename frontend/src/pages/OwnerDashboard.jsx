import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AddProperty from '../components/AddProperty';
import Messages from './Messages';
import ProfileSetup from './ProfileSetup';
import { Building2, Home, LogOut, ClipboardList, Check, X, Send, TrendingUp, Zap, Sparkles, FileText, CheckCircle2, MessageCircle, UserCircle } from 'lucide-react';
import { generateLeasePDF } from '../utils/generateLeasePDF';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const OwnerDashboard = ({ initialTab = 'properties' }) => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
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

  const handleUpdateAvailability = async (propertyId, availability) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      await axios.put(`/api/properties/${propertyId}/availability`, { availability }, config);
      setProperties(properties.map(p => p._id === propertyId ? { ...p, availability } : p));
    } catch (error) {
      console.error('Error updating availability', error);
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
    navigate('/', { replace: true });
  };

  if (!userInfo) return null;

  return (
    <div className="flex-1 bg-slate-900 flex flex-col">
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-8 py-4 flex justify-between items-center z-40 sticky top-0">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <Building2 className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">Room<span className="text-indigo-400">Ease</span></span>
            </Link>
            
            <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setActiveTab('properties')} 
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'properties' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
              >
                My Properties
              </button>
              <button 
                onClick={() => setActiveTab('messages')} 
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'messages' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
              >
                Messages
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors border shadow-lg ${activeTab === 'profile' ? 'bg-indigo-500 text-white border-indigo-500/20 shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border-white/10'}`}
            >
              <UserCircle size={16} /> Profile
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-slate-800 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors border border-white/10 shadow-lg"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className={`flex-1 ${activeTab === 'messages' ? 'p-6' : 'p-8'}`}>
        {activeTab === 'messages' ? (
          <Messages 
            embedded={true} 
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateStatus}
            onGenerateLease={generateLeasePDF}
            onSendBookingMessage={handleSendMessage}
          />
        ) : activeTab === 'profile' ? (
          <ProfileSetup embedded={true} />
        ) : (
          <>
            <header className="mb-8">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h2>
              <p className="text-slate-400 mt-2">Manage your listings, booking requests, and properties.</p>
            </header>

            {activeTab === 'properties' && (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <div className="bg-gradient-to-br from-indigo-600/90 to-purple-700/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-lg border border-indigo-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                      <TrendingUp size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={20} className="text-purple-200" />
                      <h3 className="font-bold text-purple-100">Market Insights</h3>
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
                        <div key={prop._id} className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border ${prop.availability === 'Sold' || prop.availability === 'Rented' ? 'border-red-500/10 opacity-70' : 'border-white/5 hover:border-white/10'} transition-all flex justify-between items-center`}>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-bold text-white">{prop.title}</h4>
                              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${prop.availability === 'Sold' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : prop.availability === 'Rented' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                {prop.availability || 'Available'}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm">{prop.location}</p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <p className="text-xl font-bold text-indigo-400">₹{prop.rent}<span className="text-sm text-slate-500 font-normal">/mo</span></p>
                            <select 
                              value={prop.availability || 'Available'} 
                              onChange={(e) => handleUpdateAvailability(prop._id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                            >
                              <option value="Available">Mark Available</option>
                              <option value="Rented">Mark Rented</option>
                              <option value="Sold">Mark Sold</option>
                            </select>
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
            )}
          </>
        )}
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
