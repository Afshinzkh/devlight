const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../model/Users');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// @route   GET /auth
// @desc    Validate user token
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select(
      '-password -_id -__v'
    );
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error.');
  }
});

// @route   POST /auth
// @desc    Authenticate user
// @access  Public
router.post(
  '/',
  [
    check('email', 'Valid Email Required.').isEmail(),
    check('password', 'Password Required.').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials.' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials.' }] });
      }

      const id = user.id;
      const payload = {
        user: {
          id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

module.exports = router;
