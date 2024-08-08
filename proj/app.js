const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for the slot machine page
app.get('/slot-machine', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'slot-machine.html'));
});

// Route for the profile page
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
