const express = require('express');
const router = express.Router();
const { getProperties, getPropertyById, createProperty, getMyProperties, getPendingProperties, updatePropertyStatus, getAllPropertiesAdmin, createPropertyReview, updatePropertyAvailability } = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getProperties).post(protect, upload.array('images', 5), createProperty);
router.route('/admin/all').get(protect, admin, getAllPropertiesAdmin);
router.route('/admin/pending').get(protect, admin, getPendingProperties);
router.route('/my').get(protect, getMyProperties);
router.route('/:id/status').put(protect, admin, updatePropertyStatus);
router.route('/:id/availability').put(protect, updatePropertyAvailability);
router.route('/:id/reviews').post(protect, createPropertyReview);
router.route('/:id').get(getPropertyById);

module.exports = router;
