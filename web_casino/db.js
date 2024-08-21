const { Client } = require('pg');

// Check if environment variables are set, otherwise default to local configuration
const client = new Client({
  user: process.env.DB_USER || 'casino',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'casinogame',
  password: process.env.DB_PASSWORD || 'casino',
  port: process.env.DB_PORT || 5432,
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack));

// Export the client for use in other modules
module.exports = client;


/*
2. Set Environment Variables for RDS

When you run your application in the environment where the RDS settings are used, you'll need to set the environment variables. You can set them directly in the terminal or through a configuration file.
To set the environment variables:

export DB_USER='your_rds_username'
export DB_HOST='your_rds_host'
export DB_NAME='your_rds_dbname'
export DB_PASSWORD='your_rds_password'
export DB_PORT=5432  
*/