const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
require('dotenv').config();

const seedHyderabadData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    // 1. Create a Property Owner in Ayyappa Society
    const ownerEmail = 'owner.ayyappa@example.com';
    let owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
      owner = new User({
        name: 'Arjun Kumar',
        email: ownerEmail,
        password: 'password123',
        role: 'owner',
        profile: {
          bio: 'Property owner with 10+ years of experience in Madhapur.',
          age: 45,
          gender: 'Male',
          isProfileComplete: true,
        }
      });
      await owner.save();
      console.log('Created owner:', owner.name);
    } else {
      console.log('Owner already exists:', owner.name);
    }

    // 2. Create some real-world properties in Ayyappa Society, Madhapur
    const propertiesData = [
      {
        owner: owner._id,
        title: 'Premium Private Room in Ayyappa Society',
        description: 'Spacious private room in a 3 BHK fully furnished apartment. Includes AC, WiFi, and attached balcony. Walking distance to local eateries and tech parks.',
        location: 'Ayyappa Society, Madhapur, Hyderabad',
        roomType: 'Private Room',
        furnishing: 'Fully Furnished',
        genderPreference: 'Any',
        rent: 18000,
        deposit: 36000,
        capacity: 1,
        amenities: ['WiFi', 'AC', 'Washing Machine', 'TV', 'Gym', 'Power Backup'],
        availableDates: new Date(),
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1502672260266-1c1e52d15461?auto=format&fit=crop&q=80&w=1000'
        ],
        bedrooms: 3,
        bathrooms: 3,
        floor: '4th Floor',
        status: 'verified',
        rating: 4.8,
        numReviews: 12
      },
      {
        owner: owner._id,
        title: 'Shared PG for Men - Ayyappa Society',
        description: 'Comfortable shared room (2 sharing) with daily housekeeping, meals included, and high-speed internet. Ideal for IT professionals.',
        location: 'Ayyappa Society, Madhapur, Hyderabad',
        roomType: 'Shared Room',
        furnishing: 'Fully Furnished',
        genderPreference: 'Male Only',
        rent: 10000,
        deposit: 10000,
        capacity: 2,
        amenities: ['WiFi', 'Meals Included', 'Housekeeping', 'Washing Machine', 'Power Backup'],
        availableDates: new Date(),
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd2b?auto=format&fit=crop&q=80&w=1000'
        ],
        bedrooms: 1,
        bathrooms: 1,
        floor: '2nd Floor',
        status: 'verified',
        rating: 4.2,
        numReviews: 5
      },
      {
        owner: owner._id,
        title: 'Modern 2 BHK Entire Apartment',
        description: 'Beautiful 2 BHK apartment near the main road of Ayyappa society. Comes with modern interiors, modular kitchen, and smart TV.',
        location: 'Ayyappa Society, Madhapur, Hyderabad',
        roomType: 'Entire Apartment',
        furnishing: 'Fully Furnished',
        genderPreference: 'Any',
        rent: 35000,
        deposit: 70000,
        capacity: 4,
        amenities: ['WiFi', 'AC', 'Washing Machine', 'Smart TV', 'Modular Kitchen', 'Parking'],
        availableDates: new Date(),
        images: [
          'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000'
        ],
        bedrooms: 2,
        bathrooms: 2,
        floor: '5th Floor',
        status: 'verified',
        rating: 5.0,
        numReviews: 8
      }
    ];

    for (const data of propertiesData) {
      let prop = await Property.findOne({ title: data.title });
      if (!prop) {
        prop = new Property(data);
        await prop.save();
        console.log('Created property:', prop.title);
      } else {
        console.log('Property already exists:', prop.title);
      }
    }

    // 3. Create a Tenant/User looking for rooms/roommates
    const tenantEmail = 'tenant.ayyappa@example.com';
    let tenant = await User.findOne({ email: tenantEmail });
    if (!tenant) {
      tenant = new User({
        name: 'Siddharth Rao',
        email: tenantEmail,
        password: 'password123',
        role: 'tenant',
        profile: {
          bio: 'Software Engineer working in Hitec City, looking for a chill roommate in Ayyappa Society.',
          age: 26,
          gender: 'Male',
          occupation: 'Software Engineer',
          company: 'Tech Corp',
          college: 'NIT',
          budget: 15000,
          wakeUpTime: 'Night Owl',
          cleanliness: 'Moderate',
          introvertExtrovert: 'Ambivert',
          smoking: 'No',
          alcohol: 'Occasionally',
          pets: 'Maybe',
          foodPreference: 'Any',
          hobbies: ['Coding', 'Gaming', 'Gym'],
          languages: ['English', 'Telugu', 'Hindi'],
          isProfileComplete: true,
        }
      });
      await tenant.save();
      console.log('Created tenant:', tenant.name);
    } else {
      console.log('Tenant already exists:', tenant.name);
    }

    console.log('Seeding successful!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedHyderabadData();
