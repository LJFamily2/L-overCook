// Get the search form, search input field, and search button
const searchForm = document.getElementById('search-bar');
const searchInput = document.getElementById('searchInput');
const searchButton = document.querySelector('#search-bar button[type="submit"]');
const recipeCards = document.querySelectorAll('.recipe');

// Add an event listener to the search button for the click event
searchButton.addEventListener('click', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the search query entered by the user
    const searchQuery = searchInput.value.trim().toLowerCase();

    // Check if the search query is not empty
    if (searchQuery) {
        // Loop through each recipe card
        recipeCards.forEach(recipeCard => {
            // Get the recipe name from the recipe card
            const recipeName = recipeCard.getAttribute('recipe-name').toLowerCase();
            
            // Check if the recipe name contains the search query
            if (recipeName.includes(searchQuery)) {
                // Show the recipe card if it matches the search query
                recipeCard.style.display = 'block';
            } else {
                // Hide the recipe card if it doesn't match the search query
                recipeCard.style.display = 'none';
            }
        });
    } 
});
