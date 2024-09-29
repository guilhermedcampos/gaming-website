-- Create user 'casino' with password 'casino'
CREATE USER casino WITH PASSWORD 'casino';

-- Create the database 'casinogame'
CREATE DATABASE casinogame;

-- Grant all privileges on the 'casinogame' database to the 'casino' user
GRANT ALL PRIVILEGES ON DATABASE casinogame TO casino;

-- Optional: Make 'casino' the owner of the database
ALTER DATABASE casinogame OWNER TO casino;


-- psql -U casino -d casinogame -h localhost


-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance INT DEFAULT 0
);

-- Create a unique index on the username to ensure no duplicates
CREATE UNIQUE INDEX idx_username ON users (username);


-- \dt

-- \d users
