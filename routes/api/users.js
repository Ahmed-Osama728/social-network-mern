const express = require('express');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const { check, validationResult } = require('express-validator');

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'please add a valid email').isEmail(),
    check(
      'password',
      'please enter a password with a 6 charachters min'
    ).isLength({ min: 6 })
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
          .json({ errors: [{ msg: 'email is already exist' }] });
      }

      const avatar = await gravatar.url(email, {
        s: '200',
        d: 'mm',
        r: 'pg'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.send('User Route');
    } catch (error) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);
module.exports = router;
