const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: false }));

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// In-memory user store (for simplicity, not recommended for production)
const users = {};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for the slot machine page
app.get('/slot-machine', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'views', 'slot-machine.html'));
});

// Route for the profile page
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = username;
    res.redirect('/');
  } else {
    res.send('<script>alert("Invalid username or password."); window.location.href = "/login";</script>');
  }
});

// Route for the registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Handle registration form submission
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.send('<script>alert("Username already exists."); window.location.href = "/register";</script>');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = { username, password: hashedPassword };
  req.session.user = username;
  res.redirect('/');
});

// Route for logging out
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
