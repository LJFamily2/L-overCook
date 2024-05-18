const searchForm = document.getElementById('search-bar');
const searchInput = document.getElementById('searchInput');
const recipeCards = document.querySelectorAll('.recipe');
const viewAllButton = document.getElementById('viewAll');

function viewAllRecipes() {
    recipeCards.forEach(recipeCard => {
        recipeCard.style.display = 'block';
    });
    viewAllButton.style.display = 'none';
    searchInput.value = '';
    document.getElementById('searchDropDown').classList.add('hidden');
}

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchQuery = searchInput.value.trim().toLowerCase();
    recipeCards.forEach(recipeCard => {
        const recipeName = recipeCard.textContent.trim().toLowerCase();
        if (recipeName.includes(searchQuery)) {
            recipeCard.style.display = 'block';
        } else {
            recipeCard.style.display = 'none';
        }
    });
    document.getElementById('searchDropDown').classList.add('hidden');
    viewAllButton.style.display = 'block';
});

if (viewAllButton) {
    viewAllButton.addEventListener('click', function() {
        viewAllRecipes();
        searchItems('searchInput', 'recipe-list', 'searchDropDown');
    });
}
