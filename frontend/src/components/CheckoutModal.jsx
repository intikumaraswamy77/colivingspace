import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const CheckoutModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate network delay for payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.put(`/api/bookings/${booking._id}/pay`, {}, config);
      
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onPaymentSuccess(booking._id);
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-900/50 border-b border-white/5 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="text-indigo-400" /> Secure Checkout
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
              <p className="text-slate-400">Your booking is now confirmed.</p>
            </div>
          ) : (
            <form onSubmit={handlePay}>
              <div className="mb-8 text-center">
                <p className="text-sm text-slate-400 mb-1">Total Amount (Deposit)</p>
                <p className="text-4xl font-extrabold text-white">₹{booking.property?.deposit}</p>
                <p className="text-sm font-medium text-slate-300 mt-2">{booking.property?.title}</p>
              </div>

              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg mb-4 text-center">{error}</div>}

              <div className="space-y-4 mb-8">
                <div>
                  <label htmlFor="cardNumber" className="block text-xs font-bold text-slate-400 uppercase mb-1">Card Number</label>
                  <input id="cardNumber" type="text" placeholder="4242 4242 4242 4242" className="w-full bg-slate-900/50 text-white placeholder-slate-600 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" required />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="expiryDate" className="block text-xs font-bold text-slate-400 uppercase mb-1">Expiry Date</label>
                    <input id="expiryDate" type="text" placeholder="MM/YY" className="w-full bg-slate-900/50 text-white placeholder-slate-600 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" required />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="cvc" className="block text-xs font-bold text-slate-400 uppercase mb-1">CVC</label>
                    <input id="cvc" type="text" placeholder="123" className="w-full bg-slate-900/50 text-white placeholder-slate-600 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" required />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock size={18} /> Pay ₹{booking.property?.deposit}
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                <Lock size={12}/> Payments are simulated for demo purposes.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
