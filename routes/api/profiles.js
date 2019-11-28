const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../model/Profile');
const User = require('../../model/User');
const { check, validationResult } = require('express-validator');

// @route   GET /profiles/me
// @desc    Get my own profile, needs to be in loggedIn
// @access  Public
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      userid: req.user.id
    });
    if (!profile) {
      return res.status(400).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Internal Server Error /Profiles.');
  }
});

// @route   POST /profiles
// @desc    create and update profile
// @access  Public
router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required.').notEmpty(),
      check('skills', 'skills is required.').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      status,
      skills,
      bio,
      company,
      gituser,
      website,
      location,
      experience,
      education,
      linkedin,
      facebook,
      twitter
    } = req.body;
    const skillsArray = skills.split(',').map(skill => skill.trim());
    const userid = req.user.id;
    const social = {
      linkedin,
      facebook,
      twitter
    };
    let profileFields = {
      status,
      skills: skillsArray,
      bio,
      company,
      gituser,
      website,
      location,
      experience,
      education,
      social
    };
    try {
      let profile = await Profile.findOneAndUpdate(
        { userid },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// @route   GET /profiles
// @desc    Get all profiles.
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find();
    if (!profiles) {
      return res.status(400).json({ error: 'No profile found' });
    }
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Internal Server Error /Profiles.');
  }
});

// @route   Delete /profiles/me
// @desc    delete profile and user.
// @access  Public
router.delete('/me', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ userid: req.user.id });
    await User.findOneAndRemove({ id: req.user.id });
    res.json('Successfully removed');
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Internal Server Error /Profiles.');
  }
});

module.exports = router;
