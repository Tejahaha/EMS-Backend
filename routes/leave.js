const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Leave = require('../models/leave');
const Employee = require('../models/employee');
const { auth } = require('./profile');

// Admin middleware (replicated from attendance.js)
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

// Submit leave application
router.post('/', auth, async (req, res) => {
  try {
    const { recipient, subject, content, startDate, endDate, days, reason } = req.body;
    const employee = await Employee.findById(req.employeeId);
    
    const leave = new Leave({
    employee: req.employeeId,
    recipient,
    subject,
    content,
    employeeName: employee.name,
    startDate,
    endDate,
    days,
    reason
    });

    await leave.save();
    res.status(201).json({ message: 'Leave application submitted', leave });
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
});

// Get pending leaves (admin)
router.get('/admin/pending', auth, adminAuth, async (req, res) => {
    try {
    const leaves = await Leave.find({ status: 'pending' })
    .populate('employee', 'name email')
    .sort({ appliedAt: -1 });
    res.json(leaves);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
});

// Update leave status (admin)
router.put('/admin/:id', auth, adminAuth, async (req, res) => {
    try {
    const { status, adminComment } = req.body;
    const leave = await Leave.findByIdAndUpdate(
    req.params.id,
{ status, adminComment, updatedAt: new Date() },
    { new: true }
    );

    if (!leave) {
    return res.status(404).json({ message: 'Leave application not found' });
    }

    res.json({ message: 'Leave status updated', leave });
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
});

module.exports = router;