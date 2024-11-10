document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = e.target.getAttribute('data-target');
            showSection(targetSection);
        });
    });

    document.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const section = e.target.getAttribute('data-section');
            const action = e.target.getAttribute('data-action');
            toggleForm(section, action);
        });
    });

    document.getElementById('submit-candidate')?.addEventListener('click', submitCandidate);
    document.getElementById('submit-constituency')?.addEventListener('click', submitConstituency);
    document.getElementById('submit-polling-station')?.addEventListener('click', submitPollingStation);
    document.getElementById('submit-voter')?.addEventListener('click', submitVoter);

    fetchCandidates();
    fetchConstituencies();
    fetchPollingStations();
    fetchVoters();
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function toggleForm(section, action) {
    const formId = `${section}-form`;
    const form = document.getElementById(formId);
    form.classList.toggle('hidden');
}

function fetchCandidates() {
    fetch('http://localhost:3000/candidates')
        .then(response => response.json())
        .then(data => {
            const candidatesList = document.getElementById('candidates-list');
            candidatesList.innerHTML = '';
            data.forEach(candidate => {
                const row = `<tr>
                    <td>${candidate.candidate_id}</td>
                    <td>${candidate.name}</td>
                    <td>${candidate.criminal_record}</td>
                    <td>${candidate.assets}</td>
                    <td>${candidate.party_affiliation}</td>
                    <td>${candidate.qualification}</td>
                    <td>${candidate.constituency_id}</td>
                </tr>`;
                candidatesList.innerHTML += row;
            });
        });
}

function fetchConstituencies() {
    fetch('http://localhost:3000/constituencies')
        .then(response => response.json())
        .then(data => {
            const constituenciesList = document.getElementById('constituencies-list');
            constituenciesList.innerHTML = '';
            data.forEach(constituency => {
                const row = `<tr>
                    <td>${constituency.constituency_id}</td>
                    <td>${constituency.name}</td>
                    <td>${constituency.population}</td>
                    <td>${constituency.no_of_polling_booths}</td>
                    <td>${constituency.no_of_candidates}</td>
                </tr>`;
                constituenciesList.innerHTML += row;
            });
        });
}

function fetchPollingStations() {
    fetch('http://localhost:3000/polling-stations')
        .then(response => response.json())
        .then(data => {
            const pollingStationsList = document.getElementById('polling-stations-list');
            pollingStationsList.innerHTML = '';
            data.forEach(station => {
                const row = `<tr>
                    <td>${station.station_id}</td>
                    <td>${station.location}</td>
                    <td>${station.officer_name}</td>
                    <td>${station.constituency_id}</td>
                </tr>`;
                pollingStationsList.innerHTML += row;
            });
        });
}

function fetchVoters() {
    fetch('http://localhost:3000/voters')
        .then(response => response.json())
        .then(data => {
            const votersList = document.getElementById('voters-list');
            votersList.innerHTML = '';
            data.forEach(voter => {
                const row = `<tr>
                    <td>${voter.voter_id}</td>
                    <td>${voter.name}</td>
                    <td>${voter.address}</td>
                    <td>${voter.gender}</td>
                    <td>${voter.dob}</td>
                    <td>${voter.age}</td>
                    <td>${voter.constituency_id}</td>
                </tr>`;
                votersList.innerHTML += row;
            });
        });
}

function submitCandidate() {
    const candidateData = {
        candidate_id: document.getElementById('candidate_id').value,
        name: document.getElementById('name').value,
        criminal_record: document.getElementById('criminal_record').value,
        assets: document.getElementById('assets').value,
        party_affiliation: document.getElementById('party_affiliation').value,
        qualification: document.getElementById('qualification').value,
        constituency_id: document.getElementById('constituency_id').value
    };

    fetch('http://localhost:3000/candidates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidateData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchCandidates(); // Refresh the candidates list
    })
    .catch(error => console.error('Error:', error));
}

function submitConstituency() {
    const constituencyId = document.getElementById('constituency_id').value.trim();
    const name = document.getElementById('name').value.trim();
    const population = document.getElementById('population').value.trim();
    const noOfPollingBooths = document.getElementById('no_of_polling_booths').value.trim();
    const noOfCandidates = document.getElementById('no_of_candidates').value.trim();

    // Log the input values for debugging
    console.log('Constituency ID:', constituencyId);
    console.log('Name:', name);
    console.log('Population:', population);
    console.log('Number of Polling Booths:', noOfPollingBooths);
    console.log('Number of Candidates:', noOfCandidates);

    // Validate inputs
    if (!constituencyId) {
        alert('Constituency ID is required.');
        return;
    }
    if (!name) {
        alert('Name is required.');
        return;
    }
    if (!population || isNaN(population)) {
        alert('Population must be a valid number.');
        return;
    }
    if (!noOfPollingBooths || isNaN(noOfPollingBooths)) {
        alert('Number of polling booths must be a valid number.');
        return;
    }
    if (!noOfCandidates || isNaN(noOfCandidates)) {
        alert('Number of candidates must be a valid number.');
        return;
    }

    const constituencyData = {
        constituency_id: parseInt(constituencyId, 10), // Ensure it's an integer
        name: name,
        population: parseInt(population, 10), // Ensure it's an integer
        no_of_polling_booths: parseInt(noOfPollingBooths, 10), // Ensure it's an integer
        no_of_candidates: parseInt(noOfCandidates, 10) // Ensure it's an integer
    };

    console.log('Submitting constituency data:', constituencyData);

    fetch('http://localhost:3000/constituencies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(constituencyData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchConstituencies(); // Refresh the constituencies list
    })
    .catch(error => console.error('Error:', error));
}
function submitPollingStation() {
    const pollingStationData = {
        station_id: document.getElementById('station_id').value,
        name: document.getElementById('name').value,
        constituency_id: document.getElementById('constituency_id').value,
        location: document.getElementById('location').value,
        officer_name: document.getElementById('officer_name').value
    };

    fetch('http://localhost:3000/polling-stations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pollingStationData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchPollingStations(); // Refresh the polling stations list
    })
    .catch(error => console.error('Error:', error));
}

function submitVoter() {
    const voterData = {
        voter_id: document.getElementById('voter_id').value,
        name: document.getElementById('voter_name').value,
        address: document.getElementById('address').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        age: document.getElementById('age').value,
        constituency_id: document.getElementById('voter_constituency_id').value
    };

    console.log('Submitting voter data:', voterData);

    fetch('http://localhost:3000/voters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(voterData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchVoters(); // Refresh the voters list
    })
    .catch(error => console.error('Error:', error));
}