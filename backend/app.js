const express = require('express');  // Importing Express
const mysql = require('mysql2');     // Importing MySQL2

const app = express();  // Initializing the Express app

// Database Connection Configuration
const db = mysql.createConnection({
  host: 'localhost',          // Database host (usually 'localhost' for local development)
  user: 'yourUsername',       // Your MySQL username
  password: 'yourPassword',   // Your MySQL password
  database: 'ElectionDB'      // Name of your database
});

// Connecting to the Database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL.');
});

// Basic Route to Check Server
app.get('/', (req, res) => {
  res.send('Election Management System Backend');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

