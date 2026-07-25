const express = require('express');
const router = express.Router();
const { updateProfile, findRoommates } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').put(protect, updateProfile);
router.route('/roommates').get(protect, findRoommates);

module.exports = router;
