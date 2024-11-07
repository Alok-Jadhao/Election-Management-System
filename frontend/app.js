// app.js
document.addEventListener('DOMContentLoaded', () => {
    // Fetch data for all sections when the page loads
    fetchData();

    // Attach click event listeners to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetSectionId = event.target.getAttribute('data-target');
            showSection(targetSectionId);
        });
    });

    // Function to fetch data for all sections
    function fetchData() {
        // Fetch candidates data
        fetch('http://localhost:3000/candidates')
            .then(response => response.json())
            .then(data => {
                const candidatesList = document.getElementById('candidates-list');
                data.forEach(candidate => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${candidate.name} (${candidate.party})`;
                    candidatesList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching candidates:', error));

        // Fetch constituencies data
        fetch('http://localhost:3000/constituencies')
            .then(response => response.json())
            .then(data => {
                const constituenciesList = document.getElementById('constituencies-list');
                data.forEach(constituency => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${constituency.name} (Region: ${constituency.region})`;
                    constituenciesList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching constituencies:', error));

        // Fetch polling stations data
        fetch('http://localhost:3000/polling-stations')
            .then(response => response.json())
            .then(data => {
                const pollingStationsList = document.getElementById('polling-stations-list');
                data.forEach(station => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${station.name} (Location: ${station.location})`;
                    pollingStationsList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching polling stations:', error));

        // Fetch voters data
        fetch('http://localhost:3000/voters')
            .then(response => response.json())
            .then(data => {
                const votersList = document.getElementById('voters-list');
                data.forEach(voter => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${voter.name} (Age: ${voter.age}, Constituency: ${voter.constituency})`;
                    votersList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching voters:', error));
    }

    // Function to show a specific section and hide others
    function showSection(sectionId) {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    }
});
