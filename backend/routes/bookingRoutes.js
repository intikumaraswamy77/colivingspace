const express = require('express');
const router = express.Router();
const { createBooking, getOwnerBookings, getTenantBookings, updateBookingStatus, addMessage, getAllBookingsAdmin, processPayment } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking);
router.route('/owner').get(protect, getOwnerBookings);
router.route('/tenant').get(protect, getTenantBookings);
router.route('/admin/all').get(protect, admin, getAllBookingsAdmin);
router.route('/:id/status').put(protect, updateBookingStatus);
router.route('/:id/message').post(protect, addMessage);
router.route('/:id/pay').put(protect, processPayment);

module.exports = router;
