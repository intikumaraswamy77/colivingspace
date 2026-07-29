import React, { useState } from 'react';
import axios from 'axios';
import { Home, MapPin, DollarSign, Users, PlusCircle } from 'lucide-react';

const AddProperty = ({ onPropertyAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    roomType: 'Shared Room',
    rent: '',
    deposit: '',
    capacity: '',
    amenities: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    furnishing: 'Unfurnished',
    genderPreference: 'Any',
    genderPreference: 'Any',
    availableDates: ''
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Handle amenities separately to ensure it's processed correctly
      // (Mongoose casts single string to array automatically)
      
      if (images) {
        Array.from(images).forEach(file => {
          submitData.append('images', file);
        });
      }

      const { data } = await axios.post('/api/properties', submitData, config);
      setSuccess('Property listed successfully!');
      setError('');
      setFormData({
        title: '', description: '', location: '', roomType: 'Shared Room', rent: '', deposit: '', capacity: '', amenities: '', bedrooms: '', bathrooms: '', floor: '', furnishing: 'Unfurnished', genderPreference: 'Any', availableDates: ''
      });
      setImages([]);
      if(onPropertyAdded) onPropertyAdded(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list property');
      setSuccess('');
    }
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 mt-8">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <PlusCircle className="text-indigo-400" /> List a New Property
      </h3>
      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-sm">{success}</div>}
      
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300">Property Title</label>
            <input id="title" type="text" name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 border p-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. Spacious Master Bedroom" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-300">Location</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-slate-500" /></div>
              <input id="location" type="text" name="location" required value={formData.location} onChange={handleChange} className="block w-full rounded-xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 border p-3 pl-10 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" placeholder="City, Neighborhood" />
            </div>
          </div>
          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-slate-300">Room Type</label>
            <select id="roomType" name="roomType" value={formData.roomType} onChange={handleChange} className="mt-1 block w-full rounded-xl bg-slate-900/50 border-white/10 text-white border p-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none">
              <option value="Shared Room" className="bg-slate-800">Shared Room</option>
              <option value="Private Room" className="bg-slate-800">Private Room</option>
              <option value="Entire Apartment" className="bg-slate-800">Entire Apartment</option>
            </select>
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-slate-300">Capacity (People)</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users className="h-5 w-5 text-slate-500" /></div>
              <input id="capacity" type="number" name="capacity" required min="1" value={formData.capacity} onChange={handleChange} className="block w-full rounded-xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 border p-3 pl-10 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" placeholder="2" />
            </div>
          </div>
          <div>
            <label htmlFor="rent" className="block text-sm font-medium text-slate-300">Monthly Rent (₹)</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign className="h-5 w-5 text-slate-500" /></div>
              <input id="rent" type="number" name="rent" required min="0" value={formData.rent} onChange={handleChange} className="block w-full rounded-xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 border p-3 pl-10 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" placeholder="10000" />
            </div>
          </div>
          <div>
            <label htmlFor="deposit" className="block text-sm font-medium text-slate-300">Security Deposit (₹)</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign className="h-5 w-5 text-slate-500" /></div>
              <input id="deposit" type="number" name="deposit" required min="0" value={formData.deposit} onChange={handleChange} className="block w-full rounded-xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 border p-3 pl-10 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" placeholder="20000" />
            </div>
          </div>
        </div>
        
        {formData.roomType === 'Entire Apartment' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-300">Bedrooms</label>
              <input id="bedrooms" type="number" name="bedrooms" required min="0" value={formData.bedrooms} onChange={handleChange} className="mt-1 block w-full rounded-xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 border p-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" placeholder="2" />
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-300">Bathrooms</label>
              <input id="bathrooms" type="number" name="bathrooms" required min="0" value={formData.bathrooms} onChange={handleChange} className="mt-1 block w-full rounded-xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 border p-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" placeholder="1" />
            </div>
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-slate-300">Floor</label>
              <input id="floor" type="text" name="floor" required value={formData.floor} onChange={handleChange} className="mt-1 block w-full rounded-xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 border p-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. 3rd Floor" />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="furnishing" className="block text-sm font-medium text-slate-300">Furnishing</label>
            <select id="furnishing" name="furnishing" value={formData.furnishing} onChange={handleChange} className="mt-1 block w-full rounded-xl bg-slate-900/50 border-white/10 text-white border p-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none">
              <option value="Unfurnished" className="bg-slate-800">Unfurnished</option>
              <option value="Semi-Furnished" className="bg-slate-800">Semi-Furnished</option>
              <option value="Fully Furnished" className="bg-slate-800">Fully Furnished</option>
            </select>
          </div>
          <div>
            <label htmlFor="genderPreference" className="block text-sm font-medium text-slate-300">Gender Preference</label>
            <select id="genderPreference" name="genderPreference" value={formData.genderPreference} onChange={handleChange} className="mt-1 block w-full rounded-xl bg-slate-900/50 border-white/10 text-white border p-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none">
              <option value="Any" className="bg-slate-800">Any</option>
              <option value="Male Only" className="bg-slate-800">Male Only</option>
              <option value="Female Only" className="bg-slate-800">Female Only</option>
            </select>
          </div>
          <div>
            <label htmlFor="availableDates" className="block text-sm font-medium text-slate-300">Available From</label>
            <input id="availableDates" type="date" name="availableDates" value={formData.availableDates} onChange={handleChange} className="mt-1 block w-full rounded-xl bg-slate-900/50 border-white/10 text-white border p-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
          <textarea id="description" name="description" required value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 border p-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" placeholder="Describe the property..."></textarea>
        </div>

        <div>
          <label htmlFor="amenities" className="block text-sm font-medium text-slate-300">Amenities (comma separated)</label>
          <input id="amenities" type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="mt-1 block w-full rounded-xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 border p-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" placeholder="WiFi, AC, Washing Machine, Gym" />
        </div>
        
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-slate-300">Property Images (Max 5)</label>
          <input id="images" type="file" name="images" multiple accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 transition-all border border-white/10 rounded-xl p-2 bg-slate-900/50" />
          <p className="text-xs text-slate-500 mt-1">Upload actual image files from your computer (jpg, png, webp).</p>
        </div>

        <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
          Publish Listing
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
