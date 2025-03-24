const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const Transaction = require('../models/transaction');
const PDFDocument = require('pdfkit');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.employeeId);
    if (!employee) throw new Error();
    req.employee = employee;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const adminCheck = (req, res, next) => {
  if (req.employee.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Admin: Get all employees
router.get('/employees', auth, adminCheck, async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Set employee salary
router.put('/set-salary/:id', auth, adminCheck, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    { salary: req.body.salary },
    { new: true }
    );
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Process payroll
router.post('/process-payroll', auth, adminCheck, async (req, res) => {
  try {
    const transaction = new Transaction({
      employee: req.body.employeeId,
      amount: req.body.amount
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Employee: Get payslip PDF
router.get('/payslip', auth, async (req, res) => {
  try {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=payslip.pdf');
    doc.pipe(res);
    
    doc.fontSize(20).text('Payslip', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Employee: ${req.employee.name}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Amount: $${req.employee.salary}`);
    
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;