// const searchForm = document.getElementById('search-bar');
// const searchInput = document.getElementById('searchInput');
// const recipeCards = document.querySelectorAll('.recipe');

// // Add an event listener to the search form for the submit event
// searchForm.addEventListener('submit', function(event) {
//     // Prevent the default form submission behavior
//     event.preventDefault();

//     // Get the search query entered by the user
//     const searchQuery = searchInput.value.trim().toLowerCase();

//     // Loop through each recipe card
//     recipeCards.forEach(recipeCard => {
//         // Get the recipe name from the recipe card
//         const recipeName = recipeCard.textContent.trim().toLowerCase();
        
//         // Check if the recipe name contains the search query
//         if (recipeName.includes(searchQuery)) {
//             // Show the recipe card if it matches the search query
//             recipeCard.style.display = 'block';
//         } else {
//             // Hide the recipe card if it doesn't match the search query
//             recipeCard.style.display = 'none';
//         }
//         searchInput.value = '';
//         document.getElementById('searchDropDown').style.display = 'none';
//     });
// });


