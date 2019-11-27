const express = require('express');
const router = express.Router();

// @route   GET /users
// @desc    Test the auth router
// @access  Public

router.get('/', (req, res) => {
  res.send('Users is set up');
});

module.exports = router;
