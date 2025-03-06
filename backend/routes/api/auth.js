const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

// Employee model
const Employee = require('../../models/Employee');

// @route   GET api/auth
// @desc    Get current employee
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id).select('-password');
    res.json(employee);
  } catch (err) {
    console.error('Get current employee error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/register
// @desc    Register a new employee (admin only)
// @access  Private/Admin
router.post(
  '/register',
  [
    auth,
    // Admin check middleware
    (req, res, next) => {
      if (req.employee.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
      next();
    },
    // Validation
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role must be either admin or employee').isIn(['admin', 'employee'])
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      // Check if employee already exists
      let employee = await Employee.findOne({ email });
      if (employee) {
        return res.status(400).json({ message: 'Employee already exists' });
      }

      // Create new employee
      employee = new Employee({
        name,
        email,
        password,
        role: role || 'employee',
        isActive: true
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      employee.password = await bcrypt.hash(password, salt);

      // Save employee
      await employee.save();

      res.status(201).json({
        message: 'Employee registered successfully',
        employee: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role
        }
      });
    } catch (err) {
      console.error('Register employee error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;