const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const config = require('config');
const uuidv4 = require('uuid/v1');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../model/Users');

// @route   POST /users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'name is required.').notEmpty(),
    check('email', 'email is invalid.').isEmail(),
    check('password', 'min length is 6.').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'email already exists.' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const id = uuidv4();
      user = new User({
        name,
        email,
        password,
        avatar,
        id
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

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
          user.save();
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
