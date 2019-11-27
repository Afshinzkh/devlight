const express = require('express');
const router = express.Router();

// @route   GET /posts
// @desc    Test the auth router
// @access  Public

router.get('/', (req, res) => {
  res.send('Posts is set up');
});

module.exports = router;
