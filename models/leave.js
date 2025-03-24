const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  employeeName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminComment: String,
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);