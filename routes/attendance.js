const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const auth = require('./profile').auth;

// Admin check middleware
const adminAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Submit attendance status
router.post('/', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employeeId);
    employee.attendance.push({
      timestamp: new Date(),
      status: req.body.status
    });
    await employee.save();
    res.json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all attendance data (admin only)
router.get('/admin', auth, adminAuth, async (req, res) => {
  try {
    const employees = await Employee.find().select('name email attendance');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;