const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.profile = { ...user.profile, ...req.body.profile, isProfileComplete: true };
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Find compatible roommates
// @route   GET /api/users/roommates
// @access  Private/Tenant
const findRoommates = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser.profile || !currentUser.profile.isProfileComplete) {
      return res.status(400).json({ message: 'Please complete your profile first to find roommates.' });
    }

    const myProfile = currentUser.profile;

    // Get all other tenants who have completed their profile
    const allTenants = await User.find({
      _id: { $ne: req.user._id },
      role: 'tenant',
      'profile.isProfileComplete': true
    });

    const calculateCompatibility = (me, them) => {
      let score = 0;

      // Budget (20%): Within 20% range is a match
      if (me.budget && them.budget) {
        const diff = Math.abs(me.budget - them.budget);
        const maxDiff = me.budget * 0.2;
        if (diff <= maxDiff) score += 20;
        else if (diff <= maxDiff * 2) score += 10;
      }

      // Lifestyle (introvert/extrovert, cleanliness) (30%)
      if (me.introvertExtrovert === them.introvertExtrovert) score += 15;
      else if (me.introvertExtrovert === 'Ambivert' || them.introvertExtrovert === 'Ambivert') score += 7;

      if (me.cleanliness === them.cleanliness) score += 15;
      else if (me.cleanliness === 'Moderate' || them.cleanliness === 'Moderate') score += 7;

      // Schedule (wake/sleep) (20%)
      if (me.wakeUpTime === them.wakeUpTime) score += 20;
      else if (me.wakeUpTime === 'Flexible' || them.wakeUpTime === 'Flexible') score += 10;

      // Food (10%)
      if (me.foodPreference === them.foodPreference || me.foodPreference === 'Any' || them.foodPreference === 'Any') score += 10;

      // Smoking (10%)
      if (me.smoking === them.smoking) score += 10;

      // Pets (10%)
      if (me.pets === them.pets || me.pets === 'Maybe' || them.pets === 'Maybe') score += 10;

      return Math.min(score, 100); // Max 100
    };

    const recommendedRoommates = allTenants.map(tenant => {
      const matchScore = calculateCompatibility(myProfile, tenant.profile);
      return {
        _id: tenant._id,
        name: tenant.name,
        email: tenant.email,
        profile: tenant.profile,
        matchScore
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(recommendedRoommates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, findRoommates };
