const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Basic route
app.get('/', (req, res) => {
    res.send('Election Management System Backend');
});

// Candidates Routes
app.get('/candidates', (req, res) => {
    const query = 'SELECT * FROM CandidateInfo';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching candidates:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.post('/candidates', (req, res) => {
    const { candidate_id, name, criminal_record, assets, party_affiliation, qualification, constituency_id } = req.body;

    // Check if the constituency exists
    db.query('SELECT * FROM Constituency WHERE constituency_id = ?', [constituency_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking constituency', error: err });
        }
        
        if (results.length === 0) {
            return res.status(400).json({ message: 'Constituency does not exist' });
        }

        // If constituency exists, proceed to insert the candidate
        const candidateData = [candidate_id, name, criminal_record, assets, party_affiliation, qualification, constituency_id];
        db.query('INSERT INTO CandidateInfo (candidate_id, name, criminal_record, assets, party_affiliation, qualification, constituency_id) VALUES (?, ?, ?, ?, ?, ?, ?)', candidateData, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error inserting candidate', error: err });
            }
            res.status(200).json({ message: 'Candidate inserted successfully' });
        });
    });
});

app.put('/candidates/:candidate_id', (req, res) => {
    const { candidate_id } = req.params;
    const { name, criminal_record, assets, party_affiliation, qualification, constituency_id } = req.body;

    if (!name || !criminal_record || !assets || !party_affiliation || !qualification || !constituency_id) {
        return res.status(400).send('All fields are required');
    }

    const query = 'UPDATE CandidateInfo SET name = ?, criminal_record = ?, assets = ?, party_affiliation = ?, qualification = ?, constituency_id = ? WHERE candidate_id = ?';
    db.query(query, [name, criminal_record, assets, party_affiliation, qualification, constituency_id, candidate_id], (err) => {
        if (err) {
            console.error('Error updating candidate:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.json({ message: 'Candidate updated successfully' });
    });
});

app.delete('/candidates/:candidate_id', (req, res) => {
    const { candidate_id } = req.params;
    const query = 'DELETE FROM CandidateInfo WHERE candidate_id = ?';
    db.query(query, [candidate_id], (err) => {
        if (err) {
            console.error('Error deleting candidate:', err);
            res.status(500).send('Error deleting data');
            return;
        }
        res.json({ message: 'Candidate deleted successfully' });
    });
});

// Constituencies Routes
app.get('/constituencies', (req, res) => {
    const query = 'SELECT * FROM Constituency';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching constituencies:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.post('/constituencies', (req, res) => {
    const { constituency_id, name, population, no_of_polling_booths, no_of_candidates } = req.body;

    // Check if the constituency already exists
    const checkQuery = 'SELECT * FROM Constituency WHERE constituency_id = ?';
    db.query(checkQuery, [constituency_id], (err, results) => {
        if (err) {
            console.error('Error checking constituency:', err);
            return res.status(500).json({ message: 'Error checking constituency', error: err });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Constituency ID already exists. Please use a different ID.' });
        }

        // Proceed with the insertion if no duplicate is found
        const query = 'INSERT INTO Constituency (constituency_id, name, population, no_of_polling_booths, no_of_candidates) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [constituency_id, name, population, no_of_polling_booths, no_of_candidates], (err, results) => {
            if (err) {
                console.error('Error inserting constituency:', err);
                return res.status(500).json({ message: 'Error inserting constituency', error: err });
            }
            res.status(200).json({ message: 'Constituency inserted successfully' });
        });
    });
});

app.put('/constituencies/:constituency_id', (req, res) => {
    const { constituency_id } = req.params;
    const { name, population, no_of_polling_booths, no_of_candidates } = req.body;

    if (!name || !population || !no_of_polling_booths || !no_of_candidates) {
        return res.status(400).send('All fields are required');
    }

    const query = 'UPDATE Constituency SET name = ?, population = ?, no_of_polling_booths = ?, no_of_candidates = ? WHERE constituency_id = ?';
    db.query(query, [name, population, no_of_polling_booths, no_of_candidates, constituency_id], (err) => {
        if (err) {
            console.error('Error updating constituency:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.json({ message: 'Constituency updated successfully' });
    });
});

app.delete('/constituencies/:constituency_id', (req, res) => {
    const { constituency_id } = req.params;
    const query = 'DELETE FROM Constituency WHERE constituency_id = ?';
    db.query(query, [constituency_id], (err) => {
        if (err) {
            console.error('Error deleting constituency:', err);
            res.status(500).send('Error deleting data');
            return;
        }
        res.json({ message: 'Constituency deleted successfully' });
    });
});

// Polling Stations Routes
app.get('/polling-stations', (req, res) => {
    const query = 'SELECT * FROM PollingStationInfo';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching polling stations:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.post('/polling-stations', (req, res) => {
    const { station_id, name, constituency_id, location } = req.body;

    if (!station_id || !name || !constituency_id || !location) {
        return res.status(400).send('All fields are required');
    }

    const query = 'INSERT INTO PollingStationInfo (station_id, name, constituency_id, location) VALUES (?, ?, ?, ?)';
    db.query(query, [station_id, name, constituency_id, location], (err) => {
        if (err) {
            console.error('Error inserting polling station:', err);
            res.status(500).send('Error inserting data');
            return;
        }
        res.json({ message: 'Polling Station inserted successfully' });
    });
});

app.put('/polling-stations/:station_id', (req, res) => {
    const { station_id } = req.params;
    const { name, constituency_id, location } = req.body;

    if (!name || !constituency_id || !location) {
        return res.status(400).send('All fields are required');
    }

    const query = 'UPDATE PollingStationInfo SET name = ?, constituency_id = ?, location = ? WHERE station_id = ?';
    db.query(query, [name, constituency_id, location, station_id], (err) => {
        if (err) {
            console.error('Error updating polling station:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.json({ message: 'Polling Station updated successfully' });
    });
});

app.delete('/polling-stations/:station_id', (req, res) => {
    const { station_id } = req.params;
    const query = 'DELETE FROM PollingStationInfo WHERE station_id = ?';
    db.query(query, [station_id], (err) => {
        if (err) {
            console.error('Error deleting polling station:', err);
            res.status(500).send('Error deleting data');
            return;
        }
        res.json({ message: 'Polling Station deleted successfully' });
    });
});

// Voters Routes
app.get('/voters', (req, res) => {
    const query = 'SELECT * FROM VoterInfo';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching voters:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.post('/voters', (req, res) => {
    const { voter_id, name, age, address, constituency_id, voted } = req.body;

    if (!voter_id || !name || !age || !address || !constituency_id || voted === undefined) {
        return res.status(400).send('All fields are required');
    }

    const query = 'INSERT INTO VoterInfo (voter_id, name, age, address, constituency_id, voted) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [voter_id, name, age, address, constituency_id, voted], (err) => {
        if (err) {
            console.error('Error inserting voter:', err);
            res.status(500).send('Error inserting data');
            return;
        }
        res.json({ message: 'Voter inserted successfully' });
    });
});

app.put('/voters/:voter_id', (req, res) => {
    const { voter_id } = req.params;
    const { name, age, address, constituency_id, voted } = req.body;

    if (!name || !age || !address || !constituency_id || voted === undefined) {
        return res.status(400).send('All fields are required');
    }

    const query = 'UPDATE VoterInfo SET name = ?, age = ?, address = ?, constituency_id = ?, voted = ? WHERE voter_id = ?';
    db.query(query, [name, age, address, constituency_id, voted, voter_id], (err) => {
        if (err) {
            console.error('Error updating voter:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.json({ message: 'Voter updated successfully' });
    });
});

app.delete('/voters/:voter_id', (req, res) => {
    const { voter_id } = req.params;
    const query = 'DELETE FROM VoterInfo WHERE voter_id = ?';
    db.query(query, [voter_id], (err) => {
        if (err) {
            console.error('Error deleting voter:', err);
            res.status(500).send('Error deleting data');
            return;
        }
        res.json({ message: 'Voter deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Election Management System backend listening at http://localhost:${port}`);
});
