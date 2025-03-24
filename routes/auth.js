const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');

// Register Employee
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, position, inviteLink } = req.body;
    
    // Check if email exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const employee = new Employee({ name, email, password, position });
    
    // Validate invite link
    if (inviteLink === process.env.INVITE_LINK) {
      employee.role = 'admin';
    }

    await employee.save();

    res.status(201).json({ message: 'Employee registered successfully', role: employee.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Employee
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { employeeId: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;