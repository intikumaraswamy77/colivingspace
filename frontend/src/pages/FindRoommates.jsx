import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, User, Briefcase, MapPin, Coffee, CheckCircle2, IndianRupee } from 'lucide-react';

const FindRoommates = () => {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || userInfo.role !== 'tenant') {
          navigate('/', { replace: true });
          return;
        }

        if (!userInfo.profile || !userInfo.profile.isProfileComplete) {
          setError('PROFILE_INCOMPLETE');
          setLoading(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/users/roommates', config);
        
        setRoommates(data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.message.includes('complete your profile')) {
          setError('PROFILE_INCOMPLETE');
        } else {
          setError(err.response?.data?.message || 'Failed to find roommates');
        }
        setLoading(false);
      }
    };
    fetchRoommates();
  }, [navigate]);

  if (loading) return <div className="text-center p-20">Running Smart Matchmaking Algorithm...</div>;

  if (error === 'PROFILE_INCOMPLETE') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Blobs for depth */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10 text-center max-w-lg w-full relative z-10">
          <Sparkles className="w-20 h-20 text-indigo-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
          <h2 className="text-3xl font-extrabold text-white mb-4">Let's Find Your Match</h2>
          <p className="text-slate-400 mb-8">Before our algorithm can find your perfect roommate, you need to tell us a bit about your lifestyle!</p>
          <button 
            onClick={() => navigate('/profile-setup')}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all"
          >
            Setup My Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 relative overflow-hidden">
      {/* Background Blobs for depth */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="text-indigo-400" /> Smart Roommate Matches
          </h1>
          <p className="text-xl text-slate-400">We analyzed 10+ data points to find you the most compatible roommates.</p>
        </div>

        {error && <div className="text-red-400 text-center bg-red-500/10 p-4 rounded-xl border border-red-500/20 max-w-2xl mx-auto mb-8">{error}</div>}

        {roommates.length === 0 ? (
          <div className="text-center bg-slate-800/50 backdrop-blur-sm p-12 rounded-3xl shadow-sm border border-white/5">
            <p className="text-xl text-slate-400 font-medium">No matches found yet. Try again later as more users join!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roommates.map((match) => (
              <div key={match._id} className="bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                {/* Score Badge */}
                <div className="absolute top-4 right-4 z-10 bg-indigo-600/20 backdrop-blur-md border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-2xl font-black text-xl shadow-lg flex items-center gap-2">
                  <Sparkles size={18} /> {match.matchScore}%
                </div>
                
                {/* Header */}
                <div className="h-32 bg-slate-900 flex items-end p-6 border-b border-white/5">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-black border-4 border-slate-800 shadow-md translate-y-8">
                    {match.name.charAt(0)}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 pt-12">
                  <h3 className="text-2xl font-bold text-white mb-1">{match.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-sm bg-slate-900 text-slate-300 px-3 py-1 rounded-full font-medium border border-white/10">{match.profile.age} yrs</span>
                    <span className="text-sm bg-slate-900 text-slate-300 px-3 py-1 rounded-full font-medium border border-white/10">{match.profile.gender}</span>
                    {match.profile.introvertExtrovert && (
                      <span className="text-sm bg-slate-900 text-slate-300 px-3 py-1 rounded-full font-medium border border-white/10">{match.profile.introvertExtrovert}</span>
                    )}
                    {match.profile.foodPreference && (
                      <span className="text-sm bg-slate-900 text-slate-300 px-3 py-1 rounded-full font-medium border border-white/10">{match.profile.foodPreference}</span>
                    )}
                    {match.profile.smoking && match.profile.smoking !== 'No' && (
                      <span className="text-sm bg-slate-900 text-slate-300 px-3 py-1 rounded-full font-medium border border-white/10">Smokes: {match.profile.smoking}</span>
                    )}
                    {match.profile.pets && match.profile.pets !== 'No' && (
                      <span className="text-sm bg-slate-900 text-slate-300 px-3 py-1 rounded-full font-medium border border-white/10">Pets: {match.profile.pets}</span>
                    )}
                  </div>

                  {match.profile.bio && (
                    <p className="text-sm text-slate-400 italic mb-6 line-clamp-2">"{match.profile.bio}"</p>
                  )}

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-300">
                      <Briefcase size={18} className="text-indigo-400" /> 
                      <span className="font-medium">{match.profile.occupation} {match.profile.company && `at ${match.profile.company}`}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <IndianRupee size={18} className="text-indigo-400" /> 
                      <span className="font-medium">Budget: ~{match.profile.budget}/mo</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <Coffee size={18} className="text-indigo-400" /> 
                      <span className="font-medium">{match.profile.wakeUpTime} &bull; {match.profile.cleanliness}</span>
                    </div>
                  </div>
                  
                  {/* Common Tags */}
                  <div className="border-t border-white/10 pt-6">
                    <button 
                      onClick={() => navigate(`/messages?userId=${match._id}&name=${encodeURIComponent(match.name)}`)}
                      className="w-full bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-500 text-indigo-400 hover:text-white font-bold py-3 rounded-xl transition-all"
                    >
                      Message {match.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindRoommates;
