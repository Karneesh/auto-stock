const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Employee model
const Employee = require('../../models/Employee');

// @route   POST api/employees/login
// @desc    Authenticate employee & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if employee exists
      let employee = await Employee.findOne({ email });

      if (!employee) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      // Check if employee is active
      if (!employee.isActive) {
        return res.status(400).json({ message: 'Account is inactive. Please contact your administrator.' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, employee.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      // Create JWT payload
      const payload = {
        employee: {
          id: employee.id,
          role: employee.role
        }
      };

      // Sign the token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '12h' },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            employee: {
              id: employee.id,
              name: employee.name,
              email: employee.email,
              role: employee.role
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;