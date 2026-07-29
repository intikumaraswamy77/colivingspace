import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Messages from './Messages';
import ProfileSetup from './ProfileSetup';
import { User, LogOut, Send, CheckCircle2, CreditCard, FileText, Building2, MessageCircle, UserCircle } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import { generateLeasePDF } from '../utils/generateLeasePDF';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const TenantDashboard = ({ initialTab = 'messages' }) => {
  const [bookings, setBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [replyMessage, setReplyMessage] = useState({});
  const [checkoutBooking, setCheckoutBooking] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

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
    navigate('/', { replace: true });
  };

  if (!userInfo) return null;

  return (
    <div className="flex-1 bg-slate-900 flex">
      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto relative ${activeTab === 'messages' ? 'p-6' : 'p-8'}`}>
        {activeTab === 'messages' ? (
          <Messages 
            embedded={true}
            bookings={bookings}
            onCheckoutBooking={setCheckoutBooking}
            onGenerateLease={generateLeasePDF}
            onSendBookingMessage={handleSendMessage}
          />
        ) : activeTab === 'profile' ? (
          <ProfileSetup embedded={true} />
        ) : (
          <>
            <header className="mb-8">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome, {userInfo.name}!</h2>
              <p className="text-slate-400 mt-2">Manage your bookings, leases, and communications.</p>
            </header>

          </>
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
