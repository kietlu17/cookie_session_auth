const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Session setup (with cookies)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URI }),
    cookie: {
      httpOnly: true,     // prevents client-side JS from reading cookie
      secure: false,      // set `true` if using HTTPS
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));