const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
require('dotenv').config();

const seedMoreData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // --- Owners ---
    const ownersData = [
      {
        name: 'Ramesh Reddy',
        email: 'ramesh.owner@example.com',
        password: 'password123',
        role: 'owner',
        profile: { bio: 'Managing premium PG accommodations in Madhapur.', age: 50, gender: 'Male', isProfileComplete: true }
      },
      {
        name: 'Priya Sharma',
        email: 'priya.owner@example.com',
        password: 'password123',
        role: 'owner',
        profile: { bio: 'Owner of multiple fully furnished flats in Ayyappa Society.', age: 38, gender: 'Female', isProfileComplete: true }
      },
      {
        name: 'Kiran Kumar',
        email: 'kiran.owner@example.com',
        password: 'password123',
        role: 'owner',
        profile: { bio: 'Offering budget-friendly student housing.', age: 42, gender: 'Male', isProfileComplete: true }
      }
    ];

    const ownerDocs = [];
    for (const data of ownersData) {
      let owner = await User.findOne({ email: data.email });
      if (!owner) {
        owner = new User(data);
        await owner.save();
        console.log('Created owner:', owner.name);
      }
      ownerDocs.push(owner);
    }

    // --- Properties ---
    const propertiesData = [
      {
        owner: ownerDocs[0]._id,
        title: 'Luxury Boys Hostel - Ayyappa Society',
        description: '3 sharing and 2 sharing rooms with AC, WiFi, and North/South Indian food. Daily cleaning.',
        location: 'Ayyappa Society, Madhapur, Hyderabad',
        roomType: 'Shared Room',
        furnishing: 'Fully Furnished',
        genderPreference: 'Male Only',
        rent: 12000,
        deposit: 12000,
        capacity: 3,
        amenities: ['WiFi', 'AC', 'Housekeeping', 'Meals Included', 'Power Backup'],
        availableDates: new Date(),
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000'],
        status: 'verified',
        rating: 4.5,
        numReviews: 24
      },
      {
        owner: ownerDocs[0]._id,
        title: 'Independent Studio in Madhapur',
        description: 'Cozy independent studio apartment suitable for a bachelor or couple. Close to metro station.',
        location: 'Madhapur, Hyderabad',
        roomType: 'Entire Apartment',
        furnishing: 'Semi-Furnished',
        genderPreference: 'Any',
        rent: 22000,
        deposit: 44000,
        capacity: 2,
        amenities: ['Power Backup', 'Parking', 'Security'],
        availableDates: new Date(),
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000'],
        bedrooms: 1,
        bathrooms: 1,
        status: 'verified',
        rating: 4.0,
        numReviews: 10
      },
      {
        owner: ownerDocs[1]._id,
        title: 'Spacious Master Bedroom - Girls Only',
        description: 'Master bedroom with attached washroom in a 3 BHK flat. Sharing with 2 other female IT professionals.',
        location: 'Ayyappa Society, Madhapur, Hyderabad',
        roomType: 'Private Room',
        furnishing: 'Fully Furnished',
        genderPreference: 'Female Only',
        rent: 16000,
        deposit: 32000,
        capacity: 1,
        amenities: ['WiFi', 'AC', 'Washing Machine', 'Modular Kitchen'],
        availableDates: new Date(),
        images: ['https://images.unsplash.com/photo-1502672260266-1c1e52d15461?auto=format&fit=crop&q=80&w=1000'],
        bedrooms: 3,
        bathrooms: 3,
        status: 'verified',
        rating: 4.9,
        numReviews: 18
      },
      {
        owner: ownerDocs[1]._id,
        title: 'Premium 3 BHK Flat for Family/Bachelors',
        description: 'Brand new 3 BHK flat with all amenities. Top floor with great ventilation.',
        location: 'Ayyappa Society, Madhapur, Hyderabad',
        roomType: 'Entire Apartment',
        furnishing: 'Fully Furnished',
        genderPreference: 'Any',
        rent: 55000,
        deposit: 110000,
        capacity: 6,
        amenities: ['WiFi', 'AC', 'TV', 'Gym', 'Pool', 'Parking'],
        availableDates: new Date(),
        images: ['https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80&w=1000'],
        bedrooms: 3,
        bathrooms: 3,
        status: 'verified',
        rating: 4.7,
        numReviews: 5
      },
      {
        owner: ownerDocs[2]._id,
        title: 'Budget Co-living Space (Unfurnished)',
        description: 'Affordable co-living space. Bring your own mattress and furniture. Great for students.',
        location: 'Madhapur, Hyderabad',
        roomType: 'Shared Room',
        furnishing: 'Unfurnished',
        genderPreference: 'Any',
        rent: 6000,
        deposit: 12000,
        capacity: 4,
        amenities: ['Water Supply', 'Security'],
        availableDates: new Date(),
        images: ['https://images.unsplash.com/photo-1600607688969-a5bfcd64bd2b?auto=format&fit=crop&q=80&w=1000'],
        status: 'verified',
        rating: 3.5,
        numReviews: 42
      }
    ];

    for (const data of propertiesData) {
      let prop = await Property.findOne({ title: data.title });
      if (!prop) {
        prop = new Property(data);
        await prop.save();
        console.log('Created property:', prop.title);
      }
    }

    // --- Tenants (Roommates) ---
    const tenantsData = [
      {
        name: 'Neha Verma',
        email: 'neha.tenant@example.com',
        password: 'password123',
        role: 'tenant',
        profile: {
          bio: 'Data Analyst looking for a private room in Ayyappa Society. Clean and organized.',
          age: 24, gender: 'Female', occupation: 'Data Analyst', company: 'Amazon', budget: 18000,
          wakeUpTime: 'Early Bird', cleanliness: 'Very Clean', introvertExtrovert: 'Introvert', smoking: 'No', alcohol: 'No', foodPreference: 'Vegetarian', isProfileComplete: true
        }
      },
      {
        name: 'Rahul Gupta',
        email: 'rahul.tenant@example.com',
        password: 'password123',
        role: 'tenant',
        profile: {
          bio: 'Student at local university, looking for a shared room on a budget.',
          age: 21, gender: 'Male', occupation: 'Student', college: 'JNTU', budget: 8000,
          wakeUpTime: 'Night Owl', cleanliness: 'Messy', introvertExtrovert: 'Extrovert', smoking: 'Outside', alcohol: 'Occasionally', foodPreference: 'Any', isProfileComplete: true
        }
      },
      {
        name: 'Sanya Mirza',
        email: 'sanya.tenant@example.com',
        password: 'password123',
        role: 'tenant',
        profile: {
          bio: 'Marketing manager, foodie, and loves to explore the city on weekends.',
          age: 27, gender: 'Female', occupation: 'Marketing', budget: 25000,
          wakeUpTime: 'Flexible', cleanliness: 'Moderate', introvertExtrovert: 'Ambivert', smoking: 'No', alcohol: 'Yes', foodPreference: 'Non-Vegetarian', isProfileComplete: true
        }
      }
    ];

    for (const data of tenantsData) {
      let tenant = await User.findOne({ email: data.email });
      if (!tenant) {
        tenant = new User(data);
        await tenant.save();
        console.log('Created tenant:', tenant.name);
      }
    }

    console.log('Successfully seeded more data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedMoreData();
