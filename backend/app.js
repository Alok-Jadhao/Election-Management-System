const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import the CORS package
const db = require('./db');

const app = express();
const port = 3000;

// Use CORS middleware to enable cross-origin requests
app.use(cors()); // Allow all origins to access the backend

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Basic route
app.get('/', (req, res) => {
    res.send('Election Management System Backend');
});

// DATABASE ROUTES
// Route to get all candidates from the database
app.get('/candidates', (req, res) => {
    const query = 'SELECT * FROM CandidateInfo';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching candidates:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results); // Send the query results as JSON response
    });
});

// Route to get all constituencies from the database
app.get('/constituencies', (req, res) => {
    const query = 'SELECT * FROM Constituency';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching constituencies:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results);
    });
});

// Route to get all polling stations from the database
app.get('/polling-stations', (req, res) => {
    const query = 'SELECT * FROM PollingStationInfo';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching polling stations:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results);
    });
});



// Route to get all voters from the database
app.get('/voters', (req, res) => {
    const query = 'SELECT * FROM VoterInfo';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching voters:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
