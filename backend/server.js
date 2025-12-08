const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Trade = require('./models/Trade');

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT;


// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// --- Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // Create token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Check password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Invalid password' });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Trades with optional date range filtering
app.get('/api/trades', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { userId: req.user.id };

    // Apply date range filter if provided
    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        // Start of the day
        query.date.$gte = new Date(startDate).toISOString().split('T')[0];
      }

      if (endDate) {
        // End of the day
        query.date.$lte = new Date(endDate).toISOString().split('T')[0];
      }
    }

    const trades = await Trade.find(query).sort({ createdAt: -1 });

    // Transform _id to id for frontend
    const formattedTrades = trades.map(t => ({
      ...t.toObject(),
      id: t._id
    }));
    res.json(formattedTrades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Trade
app.post('/api/trades', auth, async (req, res) => {
  try {
    const tradeData = { ...req.body, userId: req.user.id };
    const newTrade = new Trade(tradeData);
    const savedTrade = await newTrade.save();

    res.json({
      ...savedTrade.toObject(),
      id: savedTrade._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Trade
app.put('/api/trades/:id', auth, async (req, res) => {
  try {
    const updatedTrade = await Trade.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedTrade) return res.status(404).json({ error: 'Trade not found' });

    res.json({
      ...updatedTrade.toObject(),
      id: updatedTrade._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Trade
app.delete('/api/trades/:id', auth, async (req, res) => {
  try {
    const deleted = await Trade.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Trade not found' });
    res.json({ message: 'Trade deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));