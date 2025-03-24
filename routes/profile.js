const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');

// Authentication middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.employeeId = decoded.employeeId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

router.auth = auth;

// Get employee profile
router.get('/', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employeeId).select('-password');
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update employee profile
router.put('/', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const employee = await Employee.findById(req.employeeId);

    updates.forEach(update => {
      if (update !== 'password') {
        employee[update] = req.body[update];
      }
    });

    if (req.body.password) {
      employee.password = req.body.password;
    }

    await employee.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete employee profile
router.delete('/', auth, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.employeeId);
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;