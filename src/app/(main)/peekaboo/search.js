document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results");
    const errorContainer = document.getElementById("error");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const query = input.value.trim();
        
        if (query) {
            errorContainer.textContent = '';  // Clear previous error message
            searchImages(query);
        } else {
            errorContainer.textContent = 'Please enter a search term.';
        }
    });

    async function searchImages(query) {
        try {
            const apiKey = 'YOUR_API_KEY';  // Replace with your actual API key
            const apiUrl = `https://api.example.com/images?q=${encodeURIComponent(query)}&key=${apiKey}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Failed to fetch images.');
            }

            const data = await response.json();
            displayResults(data.images);
        } catch (error) {
            showError('Error fetching images: ' + error.message);
        }
    }

    function displayResults(images) {
        resultsContainer.innerHTML = '';  // Clear previous results
        
        if (images && images.length > 0) {
            images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.url;
                imgElement.alt = 'Image result';
                imgElement.style.width = '200px';
                imgElement.style.margin = '10px';
                resultsContainer.appendChild(imgElement);
            });
        } else {
            showError('No images found.');
        }
    }

    function showError(message) {
        errorContainer.textContent = message;
    }
});
