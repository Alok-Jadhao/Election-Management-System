// Fetch data from the backend
fetch('http://localhost:3000/constituencies')
  .then(response => response.json())  // Convert response to JSON
  .then(data => {
    const constituencyDiv = document.getElementById('constituencies');
    
    // Loop through the data and display each constituency
    data.forEach(constituency => {
      constituencyDiv.innerHTML += `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${constituency.name}</h5>
            <p class="card-text">Population: ${constituency.population}</p>
            <p class="card-text">Polling Booths: ${constituency.no_of_polling_booths}</p>
            <p class="card-text">Candidates: ${constituency.no_of_candidates}</p>
          </div>
        </div>
      `;
    });
  })
  .catch(error => console.error('Error fetching constituencies:', error));

