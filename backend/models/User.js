const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['tenant', 'owner', 'admin'],
    default: 'tenant',
  },
  // Profile details (useful for matching later)
  profile: {
    bio: String,
    age: Number,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    occupation: String,
    company: String,
    college: String,
    budget: Number,
    wakeUpTime: { type: String, enum: ['Early Bird', 'Night Owl', 'Flexible'] },
    cleanliness: { type: String, enum: ['Very Clean', 'Moderate', 'Messy'] },
    introvertExtrovert: { type: String, enum: ['Introvert', 'Extrovert', 'Ambivert'] },
    smoking: { type: String, enum: ['Yes', 'No', 'Outside'] },
    alcohol: { type: String, enum: ['Yes', 'No', 'Occasionally'] },
    pets: { type: String, enum: ['Yes', 'No', 'Maybe'] },
    foodPreference: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Any'] },
    hobbies: [String],
    languages: [String],
    isProfileComplete: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
