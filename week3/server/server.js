// Importing required modules
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// parse env variables
require('dotenv').config();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors());
app.use(express.json());

app.set('view engine', 'html');

// Static folder
app.use(express.static(__dirname + '/views/'));

// Defining route middleware
app.use('/api', require('./routes/api'));

// Users
app.post('/api/user', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(
      {
        error: err.message
      }
    )
  }
});
// Retrieve a user by email 
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) { 
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Success - return user
    res.status(200).json({
      message: 'Login successful',
      id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// Retrieve all users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Listening to port
    app.listen(port, () => {
      console.log(`Listening On http://localhost:${port}/api`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
