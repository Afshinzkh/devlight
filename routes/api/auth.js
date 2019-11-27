const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../model/Users');
// @route   GET /auth
// @desc    validate the token
// @access  Public

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select(
      '-password, -_id'
    );
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error.');
  }
});

module.exports = router;
