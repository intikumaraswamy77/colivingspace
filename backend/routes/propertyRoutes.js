const express = require('express');
const router = express.Router();
const { getProperties, getPropertyById, createProperty, getMyProperties, getPendingProperties, updatePropertyStatus, getAllPropertiesAdmin, createPropertyReview } = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProperties).post(protect, createProperty);
router.route('/admin/all').get(protect, admin, getAllPropertiesAdmin);
router.route('/admin/pending').get(protect, admin, getPendingProperties);
router.route('/my').get(protect, getMyProperties);
router.route('/:id/status').put(protect, admin, updatePropertyStatus);
router.route('/:id/reviews').post(protect, createPropertyReview);
router.route('/:id').get(getPropertyById);

module.exports = router;
