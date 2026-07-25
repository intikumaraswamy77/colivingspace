const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  roomType: {
    type: String,
    enum: ['Shared Room', 'Private Room', 'Entire Apartment'],
    required: true,
  },
  furnishing: {
    type: String,
    enum: ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'],
    default: 'Unfurnished'
  },
  genderPreference: {
    type: String,
    enum: ['Any', 'Male Only', 'Female Only'],
    default: 'Any'
  },
  rent: {
    type: Number,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  amenities: [String],
  availableDates: {
    type: Date,
  },
  images: [String],
  bedrooms: {
    type: Number,
  },
  bathrooms: {
    type: Number,
  },
  floor: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
