import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, IndianRupee, ShieldCheck, Sparkles, Coffee, Moon, Wifi } from 'lucide-react';

const PropertyCard = ({ property }) => {
  // Generate a consistent pseudo-random match score based on property ID
  const matchScore = React.useMemo(() => {
    const idSum = property._id ? property._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return 80 + (idSum % 20); // Score between 80 and 99
  }, [property._id]);

  // Determine a lifestyle tag based on the score logic
  const lifestyleTag = React.useMemo(() => {
    if (matchScore > 95) return { icon: <Coffee size={12}/>, text: "Work From Home Optimized", color: "bg-orange-500/10 text-orange-400 border border-orange-500/20" };
    if (matchScore > 88) return { icon: <Moon size={12}/>, text: "Night Owl Friendly", color: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" };
    return { icon: <Wifi size={12}/>, text: "High-Speed Internet", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" };
  }, [matchScore]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-sm border border-white/5 overflow-hidden hover:shadow-2xl hover:border-white/20 transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-48 bg-slate-800 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
            <span className="font-semibold text-lg">No Image</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-400 shadow-sm border border-white/10">
            {property.roomType}
          </div>
          {property.status === 'verified' && (
            <div className="bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-400 shadow-sm flex items-center gap-1 border border-emerald-500/30">
              <ShieldCheck size={12} /> Verified
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-xs font-extrabold shadow-sm border border-purple-500/30 whitespace-nowrap">
            <Sparkles size={12} className="text-purple-400" />
            {matchScore}% Match
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mb-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-500" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-500" />
            <span>Capacity: {property.capacity} people</span>
          </div>
        </div>

        {/* Smart Lifestyle Tag */}
        <div className={`mt-2 mb-4 inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-lg text-xs font-semibold ${lifestyleTag.color}`}>
          {lifestyleTag.icon} {lifestyleTag.text}
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Monthly Rent</span>
            <span className="text-xl font-extrabold text-white flex items-center">
              <IndianRupee size={18} className="text-indigo-400 mr-1" /> {property.rent}
            </span>
          </div>
          <Link 
            to={`/property/${property._id}`} 
            className="bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 hover:border-indigo-500 px-4 py-2 rounded-xl font-bold transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
