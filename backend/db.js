const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',           // MySQL host
  user: 'root',                // MySQL username as a string
  password: 'Alok@123',        // MySQL password
  database: 'ElectionManagementSystem' // Database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = db;
