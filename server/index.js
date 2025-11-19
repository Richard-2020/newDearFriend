const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// Trust proxy for accurate IP detection (important for rate limiting)
app.set('trust proxy', 1);

// CORS Configuration
// When using credentials, origin cannot be '*', must be explicit origins
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ];

// Dynamic origin function to handle ngrok URLs
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    }
    // Allow ngrok URLs (they change frequently, so we check the pattern)
    else if (origin.includes('.ngrok-free.app') || origin.includes('.ngrok.io')) {
      callback(null, true);
    }
    // In development, allow localhost with any port
    else if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:')) {
      callback(null, true);
    }
    else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Serve static files from the React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/question-board', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Question Schema
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  answer: { type: String, default: '' },
  answered: { type: Boolean, default: false },
  category: { type: String, required: true },
});

const Question = mongoose.model('Question', questionSchema);

// Admin credentials (in production, store in database or environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
// Hash for 'faithheals1853' with bcrypt (salt rounds: 10)
// Generated with: bcrypt.hash('faithheals1853', 10)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$IxapCL42xkciEaMRSAUlsOcD4eiPQGdQ3LAxMQx2GpxH9aTmEry3.';

// JWT Secret (in production, use a strong random secret from environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Rate limiting for login attempts (simple in-memory store)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Auth Middleware
const authMiddleware = (req, res, next) => {
  try {
    let token = null;
    
    // Check for token in Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    // If no token in header, check cookies
    else if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    }
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Rate limiting middleware for login
const rateLimitLogin = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (loginAttempts.has(clientIp)) {
    const attempts = loginAttempts.get(clientIp);
    const recentAttempts = attempts.filter(time => now - time < LOGIN_ATTEMPT_WINDOW);
    
    if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
      return res.status(429).json({ 
        message: 'Too many login attempts. Please try again later.' 
      });
    }
    
    loginAttempts.set(clientIp, recentAttempts);
  }
  
  next();
};

// Admin Login Route
app.post('/api/admin/login', rateLimitLogin, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check username
    if (username !== ADMIN_USERNAME) {
      // Record failed attempt
      const clientIp = req.ip || req.connection.remoteAddress;
      const attempts = loginAttempts.get(clientIp) || [];
      attempts.push(Date.now());
      loginAttempts.set(clientIp, attempts);
      
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (!isPasswordValid) {
      // Record failed attempt
      const clientIp = req.ip || req.connection.remoteAddress;
      const attempts = loginAttempts.get(clientIp) || [];
      attempts.push(Date.now());
      loginAttempts.set(clientIp, attempts);
      
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Clear login attempts on success
    const clientIp = req.ip || req.connection.remoteAddress;
    loginAttempts.delete(clientIp);

    // Generate JWT token (expires in 2 hours)
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Set httpOnly cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    // Also return token in response (for client-side storage if needed)
    res.json({ 
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin Logout Route
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logout successful' });
});

// Verify Token Route (for frontend to check if token is valid)
app.get('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// API Routes
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const question = new Question({
      text: req.body.text,
      category: req.body.category,
    });
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/questions/:id/answer', authMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    question.answer = req.body.answer;
    question.answered = true;
    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/questions/:id', authMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    await question.deleteOne();
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve React app for any non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 