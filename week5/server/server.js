// parse env variables
require('dotenv').config();

// Importing required modules
const cors = require('cors');
const session = require('express-session');
const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sendMail = require('./utils/sendMail');
const { validateRegister, validateLogin } = require('./utils/validate');

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());

// Sessions — must be before route definitions
app.use(session({
  secret:     process.env.SESSION_SECRET,
  resave:     false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000*60*60*24*7 // 7 days in milliseconds
  }
}));

// Google OAuth strategy — find or create user from Google profile
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  `${process.env.SERVER_URL || 'http://localhost:9000'}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value.toLowerCase();
    const nameParts = (profile.displayName || '').split(' ');

    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = profile.id;
        user.avatar   = profile.photos?.[0]?.value || user.avatar;
        await user.save();
      } else {
        user = await User.create({
          googleId:  profile.id,
          firstName: profile.name?.givenName  || nameParts[0]              || 'Unknown',
          lastName:  profile.name?.familyName || nameParts.slice(1).join(' ') || 'User',
          email,
          avatar: profile.photos?.[0]?.value,
        });
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

app.use(passport.initialize());

app.set('view engine', 'html');

// Static folder
app.use(express.static(__dirname + '/views/'));

// Defining route middleware
app.use('/api', require('./routes/api'));

// User
app.post('/api/user', async (req, res) => {
  
    const { isValid, errors } = validateRegister(req.body);
    if (!isValid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Data cleaning
    const firstName = req.body.firstName.trim()
    const lastName = req.body.lastName.trim()
    const email = req.body.email.toLowerCase().trim()
    const county = req.body.county.trim();
    const role = req.body.role.trim();
    const password = req.body.password.trim();

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'Email already registered' });
      }
      const user = await User.create({ firstName, lastName, email, county, role, password});
      res.status(201).json({
        message: 'Account created successfully',
        user: {
          id: user._id,
          email: user.email,
          county: user.county,
          role: user.role
        }
      })
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Retrieve a user by email
app.post('/api/auth/login', async (req, res) => {
  const { isValid, errors } = validateLogin(req.body);
  if (!isValid) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

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

    // Set session
    req.session.userId = user._id;
    req.session.role = user.role;

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

// Session read route — returns live user data from DB
app.get('/api/auth/session', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const user = await User.findById(req.session.userId).select('firstName lastName email role avatar googleId');
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: 'User not found' });
    }
    res.json({
      id:        user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      role:      user.role,
      avatar:    user.avatar || null,
      provider:  user.googleId ? 'google' : 'local',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
// On logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
})

// Step 1 — user submits email; server generates token and sends reset link
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendMail({
      to: user.email,
      subject: 'Password Reset Request — MaterialsVerify',
      html: `
        <p>You requested a password reset for your MaterialsVerify account.</p>
        <p>Click the link below to set a new password (valid for 1 hour):</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `
    });

    res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Step 2 — user submits new password with the token from the email link
app.post('/api/auth/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Reset token is invalid or has expired.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save(); // pre-save hook hashes the new password

    res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initiate Google OAuth flow
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Google OAuth callback
app.get('/api/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:8080';
    if (err || !user) {
      return res.redirect(`${clientUrl}/login?error=google_auth_failed`);
    }

    req.session.userId = user._id;
    req.session.role   = user.role;

    const params = new URLSearchParams({
      email:     user.email,
      role:      user.role,
      firstName: user.firstName,
      lastName:  user.lastName,
      ...(user.avatar ? { avatar: user.avatar } : {}),
    });
    res.redirect(`${clientUrl}/auth/google/callback?${params.toString()}`);
  })(req, res, next);
});

// Retrieve all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
