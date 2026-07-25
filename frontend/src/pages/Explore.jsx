import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import MapComponent from '../components/MapComponent';
import { Search, Filter, SlidersHorizontal, Map as MapIcon, Grid } from 'lucide-react';

const Explore = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [filters, setFilters] = useState({
    location: '',
    roomType: 'All',
    minRent: '',
    maxRent: ''
  });
  const [mapCenter, setMapCenter] = useState(null);

  const fetchProperties = async (searchLocation = filters.location) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`/api/properties?${queryParams}`);
      setProperties(data);
      
      // Geocode the search location to update map center
      if (searchLocation && searchLocation.trim() !== '') {
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchLocation)}&format=json&limit=1`);
          if (res.data && res.data.length > 0) {
            setMapCenter([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]);
          }
        } catch (geoError) {
          console.error('Error geocoding search location', geoError);
        }
      } else {
        setMapCenter(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(filters.location);
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Find Your Next Home</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">Discover shared spaces, private rooms, and whole apartments that fit your lifestyle.</p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-slate-800/80 backdrop-blur-xl p-4 rounded-3xl shadow-lg border border-white/10 flex flex-col md:flex-row gap-4 items-center transition-all hover:border-white/20">
            <div className="flex-1 w-full relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                id="searchLocation"
                type="text" 
                name="location"
                aria-label="Search by city or neighborhood"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search by city or neighborhood..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 rounded-2xl border-transparent focus:bg-slate-900 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
              />
            </div>
            
            <div className="w-full md:w-48">
              <select id="searchRoomType" name="roomType" aria-label="Room Type" value={filters.roomType} onChange={handleFilterChange} className="w-full px-4 py-3 bg-slate-900/50 rounded-2xl border-transparent focus:bg-slate-900 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none">
                <option value="All" className="bg-slate-800 text-white">All Room Types</option>
                <option value="Shared Room" className="bg-slate-800 text-white">Shared Room</option>
                <option value="Private Room" className="bg-slate-800 text-white">Private Room</option>
                <option value="Entire Apartment" className="bg-slate-800 text-white">Entire Apartment</option>
              </select>
            </div>

            <button type="submit" className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2">
              <Filter size={18} /> Search
            </button>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recommended for you</h2>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-800/80 rounded-xl shadow-sm border border-white/5 p-1 backdrop-blur-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
              >
                <Grid size={16} /> Grid
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
              >
                <MapIcon size={16} /> Map
              </button>
            </div>
            <button className="flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors ml-2">
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-12 text-center shadow-sm border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-2">No properties found</h3>
            <p className="text-slate-400">Try adjusting your search criteria or changing the location.</p>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <MapComponent properties={properties} centerLocation={mapCenter} />
          )
        )}

      </div>
    </div>
  );
};

export default Explore;
