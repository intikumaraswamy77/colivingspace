const User = require('../models/User');

const seedDemoUsers = async () => {
  try {
    const tenantExists = await User.findOne({ email: 'tenant@test.com' });
    if (!tenantExists) {
      await User.create({
        name: 'Demo Tenant',
        email: 'tenant@test.com',
        password: 'password123', // Will be hashed by pre-save hook in User model
        role: 'tenant',
        profile: {
          bio: 'Hi, I am a demo tenant looking for a great place to stay!',
          age: 25,
          gender: 'Male',
          occupation: 'Student',
          budget: 15000,
          wakeUpTime: 'Early Bird',
          cleanliness: 'Moderate',
          introvertExtrovert: 'Introvert'
        }
      });
    }

    const ownerExists = await User.findOne({ email: 'owner@test.com' });
    if (!ownerExists) {
      await User.create({
        name: 'Demo Owner',
        email: 'owner@test.com',
        password: 'password123',
        role: 'owner',
        profile: {
          bio: 'I manage several premium properties in the city.',
          age: 40,
          gender: 'Male',
          occupation: 'Property Manager'
        }
      });
    }
  } catch (error) {
    console.error('Error seeding demo users:', error.message);
  }
};

module.exports = seedDemoUsers;
