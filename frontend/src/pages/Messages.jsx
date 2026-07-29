import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Send, User, MessageCircle, CheckCheck, Check, X, FileText, CreditCard, CheckCircle2 } from 'lucide-react';

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:5000';
let socket;

const Messages = ({ 
  embedded = false, 
  bookings = [], 
  onUpdateBookingStatus, 
  onGenerateLease, 
  onCheckoutBooking, 
  onSendBookingMessage 
}) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [bookingReply, setBookingReply] = useState('');
  const [activeMsgTab, setActiveMsgTab] = useState('chats');
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const messagesEndRef = useRef(null);

  // Initialize socket and fetch conversations
  useEffect(() => {
    if (!userInfo) return;

    // Connect to socket
    socket = io(ENDPOINT);
    socket.emit('setup', userInfo._id);

    // Listen for incoming messages
    socket.on('receive_chat_message', (message) => {
      // If the message belongs to the currently active conversation, append it
      setMessages((prev) => {
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });

      // Update the conversation list's last message
      setConversations((prev) => 
        prev.map(conv => {
          if (conv._id === message.conversationId) {
            return { ...conv, lastMessage: message.text, lastMessageAt: new Date().toISOString() };
          }
          return conv;
        }).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      );
    });

    const fetchConversations = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/chat', config);
        setConversations(data);
        
        // Check if we came from clicking "Message" on someone's profile
        const searchParams = new URLSearchParams(location.search);
        const autoUserId = searchParams.get('userId');
        const autoUserName = searchParams.get('name');

        if (autoUserId && data) {
          // See if we already have a conversation with this user
          const existing = data.find(c => c.participants.some(p => p._id === autoUserId));
          if (existing) {
            setActiveConversation(existing);
          } else {
            // Create a temporary conversation object for the UI
            setActiveConversation({
              isNew: true,
              participants: [
                { _id: userInfo._id, name: userInfo.name },
                { _id: autoUserId, name: autoUserName || 'User' }
              ]
            });
          }
        } else if (data.length > 0) {
          setActiveConversation(data[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
        setLoading(false);
      }
    };

    fetchConversations();

    return () => {
      socket.disconnect();
    };
  }, [location.search, userInfoString]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation || activeConversation.isNew) {
        setMessages([]);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`/api/chat/${activeConversation._id}`, config);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();
  }, [activeConversation?._id, activeConversation?.isNew, userInfoString]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const textToSend = newMessage.trim();
    if (!textToSend) return;

    // Find the receiver
    const receiver = activeConversation.participants.find(p => p._id !== userInfo._id);
    if (!receiver) return;

    // Instantly clear input for snappy UI
    setNewMessage('');

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // Send API request
      const { data } = await axios.post('/api/chat/message', {
        receiverId: receiver._id,
        text: textToSend
      }, config);

      // Instantly show message in UI
      setMessages((prev) => {
        if (prev.some(m => m._id === data._id)) return prev;
        return [...prev, data];
      });
      
      // Update conversations list immediately
      setConversations((prev) => 
        prev.map(conv => {
          if (conv._id === data.conversationId) {
            return { ...conv, lastMessage: data.text, lastMessageAt: data.createdAt };
          }
          return conv;
        }).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      );
      
      // If it was a new conversation, we need to refresh the conversations list
      if (activeConversation.isNew) {
        const res = await axios.get('/api/chat', config);
        setConversations(res.data);
        const updatedConv = res.data.find(c => c.participants.some(p => p._id === receiver._id));
        setActiveConversation(updatedConv);
      }

    } catch (error) {
      console.error('Failed to send message', error);
      // Optional: Could revert setNewMessage if it fails
    }
  };

  const handleBookingReply = (e) => {
    e.preventDefault();
    if (!bookingReply.trim() || !activeBooking || !onSendBookingMessage) return;
    onSendBookingMessage(activeBooking._id, bookingReply);
    setBookingReply('');
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== userInfo._id) || conversation.participants[0];
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xl">Loading Messages...</div>;
  }

  const chatInterface = (
    <div className={`w-full bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex ${embedded ? 'h-[calc(100vh-8rem)]' : 'h-[85vh] max-w-6xl'}`}>
        
        {/* Left Sidebar - Conversations List */}
        <div className="w-1/3 border-r border-white/10 flex flex-col bg-slate-900/50">
          <div className="p-4 border-b border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-indigo-400 w-6 h-6" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Messages</h2>
            </div>
            {/* Tabs */}
            <div className="flex bg-slate-800/80 rounded-xl p-1">
              <button 
                onClick={() => setActiveMsgTab('chats')} 
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeMsgTab === 'chats' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                Chats
              </button>
              <button 
                onClick={() => setActiveMsgTab('requests')} 
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeMsgTab === 'requests' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                Requests 
                {bookings.filter(b => b.status === 'Pending').length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{bookings.filter(b => b.status === 'Pending').length}</span>
                )}
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {activeMsgTab === 'chats' ? (
              conversations.length === 0 ? (
                <div className="text-slate-400 text-center p-8 mt-10">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No active conversations yet.</p>
                  <p className="text-sm mt-2">Explore roommates or properties to start chatting!</p>
                </div>
              ) : (
                conversations.map(conv => {
                  const otherUser = getOtherParticipant(conv);
                  const isActive = activeConversation?._id === conv._id;
                  
                  return (
                    <div 
                      key={conv._id}
                      onClick={() => setActiveConversation(conv)}
                      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-indigo-600/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.15)]' 
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-300 font-bold text-lg border border-indigo-500/30 shrink-0">
                        {otherUser?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`font-bold truncate ${isActive ? 'text-indigo-300' : 'text-white'}`}>
                            {otherUser?.name}
                          </h3>
                          <span className="text-xs text-slate-500 shrink-0 ml-2">{formatTime(conv.lastMessageAt)}</span>
                        </div>
                        <p className="text-sm text-slate-400 truncate">{conv.lastMessage || 'Say hi!'}</p>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              // Requests Tab
              bookings.length === 0 ? (
                <div className="text-slate-400 text-center p-8 mt-10">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No booking requests yet.</p>
                </div>
              ) : (
                bookings.map(booking => {
                  const isActive = activeBooking?._id === booking._id;
                  const isOwner = userInfo.role === 'owner';
                  const otherPersonName = isOwner ? booking.tenant?.name : booking.owner?.name;
                  
                  return (
                    <div 
                      key={booking._id}
                      onClick={() => setActiveBooking(booking)}
                      className={`flex flex-col gap-2 p-4 rounded-2xl cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-indigo-600/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.15)]' 
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className={`font-bold truncate text-sm ${isActive ? 'text-indigo-300' : 'text-white'}`}>
                          {booking.property?.title}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${booking.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : booking.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center justify-between">
                        <span>{otherPersonName}</span>
                        {booking.paymentStatus === 'Paid' && <CheckCircle2 size={12} className="text-indigo-400" />}
                      </p>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div className="flex-1 flex flex-col bg-slate-900/20 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
            <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          </div>

          {activeMsgTab === 'chats' ? (
            activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-white/10 bg-slate-800/50 backdrop-blur-md flex items-center gap-4 z-10">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                    {getOtherParticipant(activeConversation)?.name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{getOtherParticipant(activeConversation)?.name}</h2>
                    <p className="text-sm text-indigo-300 flex items-center gap-2">
                      {getOtherParticipant(activeConversation)?.profile?.gender && (
                        <span className="text-slate-400 text-xs px-2 py-0.5 rounded bg-slate-900 border border-white/5">{getOtherParticipant(activeConversation).profile.gender}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 scroll-smooth">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border border-white/5">
                        <MessageCircle className="w-10 h-10 text-indigo-400/50" />
                      </div>
                      <p>This is the beginning of your conversation with {getOtherParticipant(activeConversation)?.name}.</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isMe = msg.sender === userInfo._id || msg.sender?._id === userInfo._id;
                      return (
                        <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-3xl p-4 shadow-md ${
                            isMe 
                              ? 'bg-indigo-600 text-white rounded-br-sm shadow-[0_5px_15px_rgba(79,70,229,0.2)]' 
                              : 'bg-slate-800 text-slate-200 border border-white/10 rounded-bl-sm'
                          }`}>
                            <p className="text-[15px] leading-relaxed">{msg.text}</p>
                            <div className={`text-[10px] mt-2 flex items-center gap-1 ${isMe ? 'text-indigo-200' : 'text-slate-500'}`}>
                              {formatTime(msg.createdAt)} <CheckCheck className="w-3 h-3 ml-1" />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-6 bg-slate-800/80 backdrop-blur-md border-t border-white/10 z-10">
                  <form onSubmit={sendMessage} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-slate-900 border border-white/10 text-white rounded-full px-6 py-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-500"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] hover:scale-105"
                    >
                      <Send className="w-6 h-6 ml-1" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 z-10 flex-col gap-4">
                <MessageCircle className="w-16 h-16 opacity-20" />
                <p className="text-lg">Select a conversation to start chatting</p>
              </div>
            )
          ) : (
            // Requests UI
            activeBooking ? (
              <div className="flex-1 flex flex-col z-10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-slate-800/50 backdrop-blur-md flex flex-col gap-4 shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-white">{activeBooking.property?.title}</h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {userInfo.role === 'owner' ? `Tenant: ${activeBooking.tenant?.name}` : `Owner: ${activeBooking.owner?.name}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${activeBooking.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : activeBooking.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                        {activeBooking.status}
                      </span>
                      {activeBooking.paymentStatus === 'Paid' && (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Deposit Paid
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {userInfo.role === 'owner' && activeBooking.status === 'Pending' && onUpdateBookingStatus && (
                      <>
                        <button onClick={() => onUpdateBookingStatus(activeBooking._id, 'Approved')} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors border border-emerald-500/20"><Check size={16}/> Approve</button>
                        <button onClick={() => onUpdateBookingStatus(activeBooking._id, 'Rejected')} className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors border border-red-500/20"><X size={16}/> Reject</button>
                      </>
                    )}

                    {userInfo.role === 'tenant' && activeBooking.status === 'Approved' && activeBooking.paymentStatus !== 'Paid' && onCheckoutBooking && (
                      <button onClick={() => onCheckoutBooking(activeBooking)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-colors border border-indigo-500">
                        <CreditCard size={16} /> Pay Deposit
                      </button>
                    )}

                    {activeBooking.paymentStatus === 'Paid' && onGenerateLease && (
                      <button onClick={() => onGenerateLease(activeBooking)} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md transition-colors border border-slate-600">
                        <FileText size={16} /> Download Lease
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Booking Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-900/40">
                  {!activeBooking.conversation || activeBooking.conversation.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                      <MessageCircle className="w-12 h-12 opacity-20" />
                      <p>Send a message regarding this booking request.</p>
                    </div>
                  ) : (
                    activeBooking.conversation.map((msg, index) => {
                      const isMe = msg.sender?._id === userInfo._id;
                      return (
                        <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-3xl p-4 shadow-md ${
                            isMe 
                              ? 'bg-indigo-600 text-white rounded-br-sm shadow-[0_5px_15px_rgba(79,70,229,0.2)]' 
                              : 'bg-slate-800 text-slate-200 border border-white/10 rounded-bl-sm'
                          }`}>
                            <p className="text-[15px] leading-relaxed">{msg.message}</p>
                            <div className={`text-[10px] mt-2 flex items-center gap-1 ${isMe ? 'text-indigo-200' : 'text-slate-500'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Booking Reply Input */}
                <div className="p-6 bg-slate-800/80 backdrop-blur-md border-t border-white/10 shrink-0">
                  <form onSubmit={handleBookingReply} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={bookingReply}
                      onChange={(e) => setBookingReply(e.target.value)}
                      placeholder="Type a reply regarding this request..."
                      className="flex-1 bg-slate-900 border border-white/10 text-white rounded-full px-6 py-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-500"
                    />
                    <button 
                      type="submit"
                      disabled={!bookingReply.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] hover:scale-105"
                    >
                      <Send className="w-6 h-6 ml-1" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 z-10 flex-col gap-4">
                <FileText className="w-16 h-16 opacity-20" />
                <p className="text-lg">Select a booking request to view details</p>
              </div>
            )
          )}
        </div>
      </div>
  );

  if (embedded) {
    return chatInterface;
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20 px-4 pb-8 flex justify-center">
      {chatInterface}
    </div>
  );
};

export default Messages;
