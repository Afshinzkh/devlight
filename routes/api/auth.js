const express = require('express');
const router = express.Router();

// @route   GET /auth
// @desc    Test the auth router
// @access  Public

router.get('/', (req, res) => {
  res.send('Auth is set up');
});

module.exports = router;
