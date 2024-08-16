const { Client } = require('pg');

// Create a new instance of the Client
const client = new Client({
  user: 'casino',     // Replace with your PostgreSQL user
  host: 'localhost',        // Replace with your PostgreSQL host if different
  database: 'casinogame',   // Replace with your database name
  password: 'casino', // Replace with your PostgreSQL password
  port: 5432,               // Default PostgreSQL port
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack));

// Export the client for use in other modules
module.exports = client;
