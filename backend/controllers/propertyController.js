const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { location, roomType, minRent, maxRent } = req.query;
    
    // Build filter object dynamically based on query params
    let query = { status: 'verified', availability: 'Available' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (roomType && roomType !== 'All') query.roomType = roomType;
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    const properties = await Property.find(query).populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('reviews.user', 'name');
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private/Owner
const createProperty = async (req, res) => {
  try {
    const { 
      title, description, location, roomType, rent, deposit, capacity, amenities, 
      bedrooms, bathrooms, floor, furnishing, genderPreference, availableDates
    } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    let lat, lng;
    try {
      if (location) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`, {
          headers: { 'User-Agent': 'UnifiedMentors/1.0' }
        });
        const data = await response.json();
        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lng = parseFloat(data[0].lon);
        }
      }
    } catch (geoError) {
      console.error('Geocoding error:', geoError);
    }

    const property = new Property({
      owner: req.user._id,
      title,
      description,
      location,
      lat,
      lng,
      roomType,
      rent,
      deposit,
      capacity,
      amenities,
      bedrooms,
      bathrooms,
      floor,
      furnishing,
      genderPreference,
      availableDates,
      images,
      status: 'verified'
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get owner's properties
// @route   GET /api/properties/my
// @access  Private/Owner
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending properties
// @route   GET /api/properties/admin/pending
// @access  Private/Admin
const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' }).populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property status
// @route   PUT /api/properties/:id/status
// @access  Private/Admin
const updatePropertyStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    property.status = req.body.status;
    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all properties (Admin only)
// @route   GET /api/properties/admin/all
// @access  Private/Admin
const getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await Property.find({}).populate('owner', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/properties/:id/reviews
// @access  Private
const createPropertyReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const property = await Property.findById(req.params.id);

    if (property) {
      const alreadyReviewed = property.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Property already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      property.reviews.push(review);

      property.numReviews = property.reviews.length;

      property.rating =
        property.reviews.reduce((acc, item) => item.rating + acc, 0) /
        property.reviews.length;

      await property.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property availability (Sold/Rented)
// @route   PUT /api/properties/:id/availability
// @access  Private/Owner
const updatePropertyAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this property' });
    }

    property.availability = availability;
    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  getMyProperties,
  getPendingProperties,
  updatePropertyStatus,
  getAllPropertiesAdmin,
  createPropertyReview,
  updatePropertyAvailability
};
