import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Send, CheckCircle2, CreditCard, FileText, Building2 } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import { generateLeasePDF } from '../utils/generateLeasePDF';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const TenantDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [replyMessage, setReplyMessage] = useState({});
  const [checkoutBooking, setCheckoutBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || user.role !== 'tenant') {
      navigate('/login');
    } else {
      setUserInfo(user);
      fetchMyBookings(user.token);
    }
  }, [navigate]);

  const fetchMyBookings = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/bookings/tenant', config);
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

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  if (!userInfo) return null;

  return (
    <div className="flex-1 bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 shadow-xl hidden md:flex flex-col border-r border-white/5">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">Room<span className="text-indigo-400">Ease</span></span>
          </Link>
          <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tenant Portal</div>
        </div>
        <div className="p-6 flex-1">
          <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Dashboard</p>
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center gap-3 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 rounded-xl font-medium transition-colors">
                <CheckCircle2 size={20} /> My Requests
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome, {userInfo.name}!</h2>
          <p className="text-slate-400 mt-1">Track your accommodation requests and chat with owners.</p>
        </header>

        <h3 className="text-xl font-bold text-white mb-4 border-b pb-2 border-white/10">Your Booking Requests</h3>
        {bookings.length === 0 ? (
          <div className="bg-slate-800/50 p-8 rounded-2xl shadow-sm border border-white/5 text-center text-slate-400 backdrop-blur-sm">
            You haven't requested to book any properties yet.
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/5 transition-all hover:border-white/10">
                <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${booking.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : booking.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>{booking.status}</span>
                      {booking.paymentStatus === 'Paid' && (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Deposit Paid
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white">Request for <span className="text-indigo-400">{booking.property?.title}</span></h4>
                    <p className="text-slate-400 text-sm">Owner: {booking.owner?.name}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    {booking.status === 'Approved' && booking.paymentStatus !== 'Paid' && (
                      <button 
                        onClick={() => setCheckoutBooking(booking)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center gap-2 border border-slate-600"
                      >
                        <CreditCard size={16} /> Pay Deposit
                      </button>
                    )}
                    
                    {booking.paymentStatus === 'Paid' && (
                      <button 
                        onClick={() => generateLeasePDF(booking)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-colors flex items-center gap-2"
                      >
                        <FileText size={16} /> Download Lease
                      </button>
                    )}
                  </div>
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
                    aria-label="Type a reply to the owner"
                    value={replyMessage[booking._id] || ''} 
                    onChange={(e) => setReplyMessage({...replyMessage, [booking._id]: e.target.value})}
                    placeholder="Type a reply to the owner..."
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
      </main>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={!!checkoutBooking} 
        onClose={() => setCheckoutBooking(null)} 
        booking={checkoutBooking} 
        onPaymentSuccess={(id) => {
          setBookings(bookings.map(b => b._id === id ? { ...b, paymentStatus: 'Paid' } : b));
        }}
      />
    </div>
  );
};

export default TenantDashboard;
