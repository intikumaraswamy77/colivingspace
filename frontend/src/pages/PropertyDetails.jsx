import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Users, IndianRupee, CheckCircle2, ArrowLeft, Send, BedDouble, Bath, Layers, Armchair, Calendar, User, ShieldCheck, Star, MessageCircle } from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const [tenantMessage, setTenantMessage] = useState("Hi, I'm interested in booking this property!");
  const [bookingStatus, setBookingStatus] = useState(null); // 'success' or 'error'
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`/api/properties/${id}`);
        setProperty(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch property details.');
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const bookRequestHandler = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      await axios.post('/api/bookings', { propertyId: id, message: tenantMessage }, config);
      setBookingStatus('success');
      setBookingMsg('Booking request sent successfully!');
    } catch (err) {
      setBookingStatus('error');
      setBookingMsg(err.response?.data?.message || 'Failed to send request');
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`/api/properties/${id}/reviews`, { rating, comment }, config);
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      // Refetch property
      const { data } = await axios.get(`/api/properties/${id}`);
      setProperty(data);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error || !property) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h2 className="text-2xl font-bold text-white mb-4">{error || 'Property not found'}</h2>
      <button onClick={() => navigate(-1)} className="text-indigo-400 hover:underline flex items-center gap-2">
        <ArrowLeft size={16} /> Go Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Hero Image */}
      <div className="h-[40vh] bg-slate-900 w-full relative">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-800">No Image Available</div>
        )}
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-xl px-4 py-2 rounded-full font-medium text-white shadow-lg border border-white/10 flex items-center gap-2 hover:bg-slate-800 transition-colors">
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/5 p-8 md:p-12 flex flex-col lg:flex-row gap-12">
          
          {/* Main Info */}
          <div className="flex-1">
            <div className="flex gap-3 mb-4">
              <div className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-bold tracking-wide border border-indigo-500/20">
                {property.roomType}
              </div>
              <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-bold tracking-wide shadow-sm border border-yellow-500/20">
                <Star size={16} className="fill-yellow-500" /> {property.rating ? property.rating.toFixed(1) : 'No Reviews'}
              </div>
              {property.status === 'verified' && (
                <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-bold tracking-wide shadow-sm border border-emerald-500/20">
                  <ShieldCheck size={16} /> Admin Verified
                </div>
              )}
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-4">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-8">
              <div className="flex items-center gap-2 text-lg">
                <MapPin className="text-indigo-400" /> {property.location}
              </div>
              {property.bedrooms && (
                <div className="flex items-center gap-2 text-lg">
                  <BedDouble className="text-indigo-400" /> {property.bedrooms} Bedrooms
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2 text-lg">
                  <Bath className="text-indigo-400" /> {property.bathrooms} Bathrooms
                </div>
              )}
              {property.floor && (
                <div className="flex items-center gap-2 text-lg">
                  <Layers className="text-indigo-400" /> {property.floor}
                </div>
              )}
              {property.furnishing && (
                <div className="flex items-center gap-2 text-lg">
                  <Armchair className="text-indigo-400" /> {property.furnishing}
                </div>
              )}
              {property.genderPreference && (
                <div className="flex items-center gap-2 text-lg">
                  <User className="text-indigo-400" /> {property.genderPreference}
                </div>
              )}
              {property.availableDates && (
                <div className="flex items-center gap-2 text-lg text-emerald-400 font-medium">
                  <Calendar className="text-emerald-400" /> Available from {new Date(property.availableDates).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="prose prose-lg text-slate-300 mb-10 prose-invert">
              <h3 className="text-xl font-bold text-white mb-3">About this space</h3>
              <p>{property.description}</p>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="text-emerald-400" size={20} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 pt-10 border-t border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Reviews & Ratings</h3>
              
              {property.reviews && property.reviews.length === 0 && (
                <div className="bg-slate-900/50 p-6 rounded-xl text-center text-slate-500 mb-8 border border-white/5">
                  No reviews yet. Be the first to review!
                </div>
              )}

              <div className="space-y-6 mb-10">
                {property.reviews && property.reviews.map((review) => (
                  <div key={review._id} className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-white">{review.name}</p>
                        <p className="text-sm text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Write Review Form */}
              <div className="bg-slate-900/80 p-8 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md">
                <h4 className="text-xl font-bold text-white mb-4">Write a Review</h4>
                {reviewError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm mb-4">{reviewError}</div>}
                {reviewSuccess && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-sm mb-4">{reviewSuccess}</div>}
                <form onSubmit={submitReviewHandler} className="space-y-4">
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-slate-300 mb-1">Rating</label>
                    <select 
                      id="rating"
                      value={rating} 
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border-white/10 text-white border p-3 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-slate-300 mb-1">Comment</label>
                    <textarea 
                      id="comment"
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)}
                      rows="3"
                      required
                      className="w-full rounded-xl bg-slate-800 border-white/10 text-white placeholder-slate-500 border p-3 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Share your experience..."
                    ></textarea>
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>

          </div>

          {/* Booking Card */}
          <div className="w-full lg:w-96">
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 sticky top-8">
              <div className="flex items-end gap-1 mb-6 text-white">
                <span className="text-4xl font-extrabold flex items-center"><IndianRupee size={32} className="text-indigo-400 mr-1"/>{property.rent}</span>
                <span className="text-slate-400 mb-1">/ month</span>
              </div>
              
              <div className="space-y-4 mb-6 text-slate-300">
                <div className="flex justify-between pb-4 border-b border-white/10">
                  <span className="text-slate-400">Security Deposit</span>
                  <span className="font-semibold text-white flex items-center"><IndianRupee size={16}/>{property.deposit}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-white/10">
                  <span className="text-slate-400">Capacity</span>
                  <span className="font-semibold text-white flex items-center gap-2"><Users size={16}/> {property.capacity} people</span>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1">Send a message to the owner</label>
                  <textarea 
                    id="message"
                    value={tenantMessage} 
                    onChange={(e) => setTenantMessage(e.target.value)}
                    rows="3"
                    className="w-full rounded-xl bg-slate-800 border border-white/10 p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-white"
                  ></textarea>
                </div>
              </div>

              {bookingMsg && (
                <div className={`mb-4 p-3 rounded-xl text-sm text-center font-medium border ${bookingStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {bookingMsg}
                </div>
              )}

              <button 
                onClick={bookRequestHandler}
                className="w-full bg-indigo-600 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all flex justify-center items-center gap-2"
              >
                <Send size={20} /> Request to Book
              </button>
              
              <button 
                onClick={() => navigate(`/messages?userId=${property.owner?._id}&name=${encodeURIComponent(property.owner?.name)}`)}
                className="w-full mt-3 bg-slate-800 text-indigo-400 font-bold text-lg py-4 rounded-xl border border-indigo-500/20 hover:bg-slate-700 hover:border-indigo-500 transition-all flex justify-center items-center gap-2"
              >
                <MessageCircle size={20} /> Message Owner
              </button>
              
              <p className="text-center text-sm text-slate-500 mt-4">
                Listed by <span className="font-semibold text-slate-300">{property.owner?.name}</span>
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
