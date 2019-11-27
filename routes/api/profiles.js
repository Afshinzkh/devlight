const express = require('express');
const router = express.Router();

// @route   GET /profiles
// @desc    Test the auth router
// @access  Public

router.get('/', (req, res) => {
  res.send('Profiles is set up');
});

module.exports = router;
