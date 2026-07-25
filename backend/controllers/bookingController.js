const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private (Tenant)
const createBooking = async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if already booked by this user
    const existingBooking = await Booking.findOne({ property: propertyId, tenant: req.user._id });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already sent a request for this property' });
    }

    const booking = new Booking({
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner,
      conversation: message ? [{ sender: req.user._id, message }] : [],
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for an owner
// @route   GET /api/bookings/owner
// @access  Private (Owner)
const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property', 'title location')
      .populate('tenant', 'name email profile');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Approve/Reject)
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the owner
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for a tenant
// @route   GET /api/bookings/tenant
// @access  Private (Tenant)
const getTenantBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate('property', 'title location')
      .populate('owner', 'name email profile');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a message to a booking
// @route   POST /api/bookings/:id/message
// @access  Private (Tenant or Owner)
const addMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify participant
    if (booking.owner.toString() !== req.user._id.toString() && booking.tenant.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this booking' });
    }

    booking.conversation.push({ sender: req.user._id, message });
    await booking.save();
    
    // Return updated booking with populated fields
    const updatedBooking = await Booking.findById(req.params.id)
      .populate('property', 'title location')
      .populate('tenant', 'name email profile')
      .populate('owner', 'name email profile') // Add owner population here
      .populate('conversation.sender', 'name');
      
    // Emit real-time event to the specific booking room
    const io = req.app.get('io');
    if (io) {
      io.to(req.params.id).emit('receive_message', updatedBooking);
    }
      
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('property', 'title location')
      .populate('tenant', 'name email profile')
      .populate('owner', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process payment for booking (Simulated)
// @route   PUT /api/bookings/:id/pay
// @access  Private (Tenant)
const processPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.tenant.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to pay for this booking' });
    }

    if (booking.status !== 'Approved') {
      return res.status(400).json({ message: 'Booking is not approved yet' });
    }

    booking.paymentStatus = 'Paid';
    const updatedBooking = await booking.save();
    
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getOwnerBookings,
  getTenantBookings,
  updateBookingStatus,
  addMessage,
  getAllBookingsAdmin,
  processPayment
};
