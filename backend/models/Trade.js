const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  instrument: {
    type: String,
    required: true
  },
  direction: {
    type: String,
    enum: ['LONG', 'SHORT'],
    required: true
  },
  outcome: {
    type: String,
    enum: ['WIN', 'LOSS', 'BREAK_EVEN'],
    required: true
  },
  pnl: {
    type: Number,
    required: true
  },
  setup: {
    type: String
  },
  notes: {
    type: String
  },
  screenshotUrl: {
    type: String
  },
  aiAnalysis: {
    type: String
  },
  createdAt: {
    type: Number,
    default: () => Date.now()
  }
});

module.exports = mongoose.model('Trade', tradeSchema);