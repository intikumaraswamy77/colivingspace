import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserCheck } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [profile, setProfile] = useState({
    bio: '',
    age: '',
    gender: 'Male',
    occupation: '',
    company: '',
    college: '',
    budget: '',
    wakeUpTime: 'Flexible',
    cleanliness: 'Moderate',
    introvertExtrovert: 'Ambivert',
    smoking: 'No',
    alcohol: 'No',
    pets: 'Maybe',
    foodPreference: 'Any',
    hobbies: '',
    languages: ''
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const hobbiesArray = profile.hobbies.split(',').map(item => item.trim());
      const languagesArray = profile.languages.split(',').map(item => item.trim());

      const { data } = await axios.put('/api/users/profile', {
        profile: {
          ...profile,
          age: Number(profile.age),
          budget: Number(profile.budget),
          hobbies: hobbiesArray,
          languages: languagesArray
        }
      }, config);

      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/tenant-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 relative overflow-hidden">
      {/* Background Blobs for depth */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <UserCheck className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-white">Complete Your Lifestyle Profile</h1>
          <p className="text-lg text-slate-400 mt-2">Help our AI find you the perfect roommates by answering a few quick questions.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-12">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-8">{error}</div>}
          
          <div className="space-y-12">
            {/* Basic Info */}
            <section>
              <h3 className="text-2xl font-bold text-white border-b border-white/10 pb-4 mb-6">Basic Information</h3>
              <div className="mb-6">
                <label htmlFor="bio" className="block text-sm font-bold text-slate-300 mb-2">Short Bio</label>
                <textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} rows="3" placeholder="Tell potential roommates a bit about yourself..." className="w-full bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none transition-all"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="age" className="block text-sm font-bold text-slate-300 mb-2">Age</label>
                  <input id="age" type="number" name="age" required value={profile.age} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-bold text-slate-300 mb-2">Gender</label>
                  <select id="gender" name="gender" value={profile.gender} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all">
                    <option value="Male" className="bg-slate-800">Male</option>
                    <option value="Female" className="bg-slate-800">Female</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="occupation" className="block text-sm font-bold text-slate-300 mb-2">Occupation</label>
                  <input id="occupation" type="text" name="occupation" required value={profile.occupation} onChange={handleChange} placeholder="e.g. Software Engineer, Student" className="w-full bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="budget" className="block text-sm font-bold text-slate-300 mb-2">Budget (per month)</label>
                  <input id="budget" type="number" name="budget" required value={profile.budget} onChange={handleChange} placeholder="e.g. 15000" className="w-full bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>
            </section>

            {/* Lifestyle */}
            <section>
              <h3 className="text-2xl font-bold text-white border-b border-white/10 pb-4 mb-6">Lifestyle & Habits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="wakeUpTime" className="block text-sm font-bold text-slate-300 mb-2">Wake Up Time</label>
                  <select id="wakeUpTime" name="wakeUpTime" value={profile.wakeUpTime} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all">
                    <option value="Early Bird" className="bg-slate-800">Early Bird</option>
                    <option value="Night Owl" className="bg-slate-800">Night Owl</option>
                    <option value="Flexible" className="bg-slate-800">Flexible</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cleanliness" className="block text-sm font-bold text-slate-300 mb-2">Cleanliness</label>
                  <select id="cleanliness" name="cleanliness" value={profile.cleanliness} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all">
                    <option value="Very Clean" className="bg-slate-800">Very Clean</option>
                    <option value="Moderate" className="bg-slate-800">Moderate</option>
                    <option value="Messy" className="bg-slate-800">Messy</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="introvertExtrovert" className="block text-sm font-bold text-slate-300 mb-2">Personality</label>
                  <select id="introvertExtrovert" name="introvertExtrovert" value={profile.introvertExtrovert} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all">
                    <option value="Introvert" className="bg-slate-800">Introvert</option>
                    <option value="Extrovert" className="bg-slate-800">Extrovert</option>
                    <option value="Ambivert" className="bg-slate-800">Ambivert</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="smoking" className="block text-sm font-bold text-slate-300 mb-2">Smoking</label>
                  <select id="smoking" name="smoking" value={profile.smoking} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all">
                    <option value="No" className="bg-slate-800">No</option>
                    <option value="Yes" className="bg-slate-800">Yes</option>
                    <option value="Outside" className="bg-slate-800">Outside Only</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="alcohol" className="block text-sm font-bold text-slate-300 mb-2">Alcohol</label>
                  <select id="alcohol" name="alcohol" value={profile.alcohol} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all">
                    <option value="No" className="bg-slate-800">No</option>
                    <option value="Yes" className="bg-slate-800">Yes</option>
                    <option value="Occasionally" className="bg-slate-800">Occasionally</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="foodPreference" className="block text-sm font-bold text-slate-300 mb-2">Food Preference</label>
                  <select id="foodPreference" name="foodPreference" value={profile.foodPreference} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all">
                    <option value="Any" className="bg-slate-800">Any</option>
                    <option value="Vegetarian" className="bg-slate-800">Vegetarian</option>
                    <option value="Non-Vegetarian" className="bg-slate-800">Non-Vegetarian</option>
                    <option value="Vegan" className="bg-slate-800">Vegan</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Extras */}
            <section>
              <h3 className="text-2xl font-bold text-white border-b border-white/10 pb-4 mb-6">Extras</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="hobbies" className="block text-sm font-bold text-slate-300 mb-2">Hobbies (comma separated)</label>
                  <input id="hobbies" type="text" name="hobbies" value={profile.hobbies} onChange={handleChange} placeholder="Reading, Gaming, Gym" className="w-full bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="languages" className="block text-sm font-bold text-slate-300 mb-2">Languages (comma separated)</label>
                  <input id="languages" type="text" name="languages" value={profile.languages} onChange={handleChange} placeholder="English, Hindi" className="w-full bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex justify-end">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white font-bold text-lg px-12 py-4 rounded-xl hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] disabled:opacity-50">
              {loading ? 'Saving Profile...' : 'Save & Generate Compatibility Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
