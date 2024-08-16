const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const pool = require('./db'); // Import the database pool

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  try {
    const result = await pool.query('SELECT balance FROM users WHERE username = $1', [req.session.user.username]);
    const balance = result.rows[0].balance;
    res.render('index', { username: req.session.user.username, balance });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.sendStatus(500);
  }
});

app.get('/slot-machine', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  try {
    const result = await pool.query('SELECT balance FROM users WHERE username = $1', [req.session.user.username]);
    const balance = result.rows[0].balance;
    res.render('slot-machine', { balance });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.sendStatus(500);
  }
});

app.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  try {
    const result = await pool.query('SELECT balance FROM users WHERE username = $1', [req.session.user.username]);
    const balance = result.rows[0].balance;
    res.render('profile', { username: req.session.user.username, balance });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.sendStatus(500);
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = { username, balance: user.balance };
      res.redirect('/');
    } else {
      res.send('<script>alert("Invalid username or password."); window.location.href = "/login";</script>');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.sendStatus(500);
  }
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      return res.send('<script>alert("Username already exists."); window.location.href = "/register";</script>');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password, balance) VALUES ($1, $2, $3)', [username, hashedPassword, 0]);
    req.session.user = { username, balance: 0 };
    res.redirect('/');
  } catch (error) {
    console.error('Error during registration:', error);
    res.sendStatus(500);
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.post('/deposit', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const depositAmount = parseInt(req.body.amount, 10);
  if (depositAmount > 0) {
    try {
      await pool.query('UPDATE users SET balance = balance + $1 WHERE username = $2', [depositAmount, req.session.user.username]);
      req.session.user.balance += depositAmount;
    } catch (error) {
      console.error('Error updating balance:', error);
      return res.sendStatus(500);
    }
  }
  res.redirect('/');
});

app.post('/update-balance', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const { balance } = req.body;
  try {
    await pool.query('UPDATE users SET balance = $1 WHERE username = $2', [parseInt(balance, 10), req.session.user.username]);
    req.session.user.balance = parseInt(balance, 10);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating balance:', error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
