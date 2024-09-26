document.addEventListener('DOMContentLoaded', () => {
    let recommendationsData = [];

    // Fetch data from the JSON file
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            recommendationsData = data;
        })
        .catch(error => console.error('Error fetching recommendations:', error));

    const btnSearch = document.getElementById('btnSearch');
    const btnReset = document.getElementById('btnReset');
    const destinationInput = document.getElementById('destinationInput');
    const recommendationsSection = document.getElementById('recommendations');

    const handleSearch = () => {
        const searchTerm = destinationInput.value.trim().toLowerCase();
        recommendationsSection.innerHTML = ''; // Clear previous results

        if (searchTerm.includes('beach')) {
            displayRecommendations(recommendationsData.beaches);
        } else if (searchTerm.includes('temple')) {
            displayRecommendations(recommendationsData.temples);
        } else {
            let found = false;
            recommendationsData.countries.forEach(country => {
                if (country.name.toLowerCase().includes(searchTerm)) {
                    displayRecommendations(country.cities);
                    found = true;
                } else {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(searchTerm)) {
                            displayRecommendations([city]);
                            found = true;
                        }
                    });
                }
            });
            if (!found) {
                // Display styled no recommendations message
                const noRecommendationsMessage = document.createElement('div');
                noRecommendationsMessage.className = 'no-recommendations-message';
                noRecommendationsMessage.textContent = 'No recommendations found for the entered keyword.';
                recommendationsSection.appendChild(noRecommendationsMessage);
            }
        }
    };

    btnSearch.addEventListener('click', handleSearch);

    btnReset.addEventListener('click', () => {
        destinationInput.value = '';
        recommendationsSection.innerHTML = '';
    });

    destinationInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    });

    function displayRecommendations(recommendations) {
        recommendations.forEach((recommendation, index) => {
            if (index < 2) { // Limit to 2 recommendations
                const recommendationCard = document.createElement('div');
                recommendationCard.className = 'recommendation-card';

                const img = document.createElement('img');
                img.src = `./img/${recommendation.imageUrl}`;
                img.alt = recommendation.name;

                const title = document.createElement('h3');
                title.textContent = recommendation.name;

                const description = document.createElement('p');
                description.textContent = recommendation.description;

                recommendationCard.appendChild(img);
                recommendationCard.appendChild(title);
                recommendationCard.appendChild(description);

                recommendationsSection.appendChild(recommendationCard);
            }
        });
    }
});