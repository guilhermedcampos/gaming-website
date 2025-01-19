# CasinoWebApp

CasinoWebApp is a web application built with Node.js and Express, designed to simulate a casino slot machine game. This project provides a practical example of a full-stack application using modern web technologies and cloud services, specifically AWS Elastic Beanstalk.

## Why?

I created this project out of curiosity and as an opportunity to explore various technologies and concepts, including modern web development with Node.js and Express, database integration using PostgreSQL, and deploying scalable applications with AWS Elastic Beanstalk. It also allowed me to test dynamic content updates and implement features like authentication, session management, and balance tracking — all while building a prototype for small web casino (with a single game, at least just for now).

## Getting Started

This project is an excellent way to showcase a Node.js and Express application integrated with AWS. The casino slot machine theme is engaging and allows for a variety of features and functionalities to be implemented, such as user authentication, session management, and dynamic content updates.

Building a casino website provides:
- **Engaging User Experience**: A game-based application is interactive and demonstrates dynamic content updates and state management.
- **Complex Features**: Handling user authentication, session management, and real-time updates can be a challenge, showcasing the robustness of Node.js and Express.
- **Real-World Use Case**: Simulates a real-world application where users interact with the system, make transactions, and receive feedback, making it a comprehensive example of web application development.

## Prerequisites

Before you begin, ensure you have the following installed and configured:
- **Node.js** (v14.x or later): For running the application server.
- **npm**: Node.js package manager for managing dependencies.
- **AWS CLI**: To interact with AWS services from the command line.
- **Elastic Beanstalk CLI**: For deploying applications to AWS Elastic Beanstalk.

## Authentication

The application uses session-based authentication to manage user sessions. Users can:
- **Register**: Create a new account with a username and password.
- **Login**: Access the site by entering valid credentials.
- **Logout**: End the session and redirect to the login page.

Authentication is managed using `express-session` and `bcrypt` for password hashing.

## Node.js and Express

- **Node.js**: A JavaScript runtime for building scalable server-side applications.
- **Express**: A web application framework for Node.js that simplifies routing and middleware management.

Key features include:
- **Routing**: Handles different routes for home, slot machine, profile, and authentication pages.
- **Middleware**: Manages form data parsing, session handling, and static file serving.

## AWS

- **AWS Elastic Beanstalk**: A service for deploying and scaling web applications. It handles infrastructure management and scaling, allowing developers to focus on writing code.

## How to Deploy

1. **Set Up AWS CLI and Elastic Beanstalk CLI**:
   - Configure AWS CLI with your credentials:
     ```bash
     aws configure
     ```
   - Initialize Elastic Beanstalk:
     ```bash
     eb init
     ```
   - Create an environment and deploy:
     ```bash
     eb create <environment-name>
     eb deploy
     ```

2. **Update Your Application**:
   - Make changes to `app.js` or other files.
   - Deploy updates:
     ```bash
     eb deploy
     ```

For detailed deployment steps, refer to the [AWS Elastic Beanstalk documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html).

## Running the website with Node.js

If connecting to AWS isn't a priority, simply run the website on localhost with the following command:

```
node web_casino/app.js
```

## Postgres 

### Connecting to PostgreSQL (`psql`)

To connect to PostgreSQL using the `psql` command-line interface, open your terminal and run:

```bash
sudo -u postgres psql
```

### Create the USER and DATABASE instances

In the psql command-line, run the following:


```psql
Create user 'casino' with password 'casino':
CREATE USER casino WITH PASSWORD 'casino';

-- Create the database 'casinogame'
CREATE DATABASE casinogame;

-- Grant all privileges on the 'casinogame' database to the 'casino' user
GRANT ALL PRIVILEGES ON DATABASE casinogame TO casino;

-- Make 'casino' the owner of the database
ALTER DATABASE casinogame OWNER TO casino;
```

Now the users table can be created by connecting to the database and running:

```bash
\c casinogame
```

```
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance INT DEFAULT 0
);

CREATE UNIQUE INDEX idx_username ON users (username);
```

Ensure the table is properly set up by running: 

```
\d users
```

You now have PostgreSQL set up with a user, a database, and a table ready for use.

## Conclusion and Future Updates

Currently, the web casino only features one game. While adding more games is something I may consider in the future, the primary focus of this project was to explore backend development, web technologies, and deployment rather than to create a complex or fully polished slot game. As such, there are minor visual bugs in the combo-winning lines, which were not a priority to fix given the scope of the project.

