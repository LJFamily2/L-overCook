let filterIcon = document.querySelector('.filter-icon-container');

let filterCriteria = document.querySelector('.filter-criteria');


filterIcon.addEventListener('click', () => {
   filterCriteria.classList.toggle('hidden');
   filterCriteria.classList.toggle('show');
});


function getSelectedButtonIds() {
   const selectedButtons = document.querySelectorAll(
      '.selectable-button.selected'
   );

   const selectedIngredients = [];
   selectedButtons.forEach((button) => {
      selectedIngredients.push(button.id);
   });
   return selectedIngredients;
}

// Function to toggle selection state of the button and update pantry items
function toggleSelection(button) {
    button.classList.toggle('selected');
    const selectedIngredients = getSelectedButtonIds();
 
    // Update pantry items based on selected ingredients
    updatePantryList(selectedIngredients);
 
    // Update the number of ingredients displayed in the pantry icon
    updatePantryCount(selectedIngredients.length);
 
    // Update active status of ingredient in search bar
    const ingredientId = button.id;
    const activeStatus = document.querySelector(`.active-status#${CSS.escape(ingredientId)}`);
 
    if (button.classList.contains('selected')) {
        activeStatus.textContent = '-';
        filterRecipes();
    } else {
        activeStatus.textContent = '+';
        const ingredientMatch = document.querySelector('.ingredient-match');
       ingredientMatch.innerHTML = '';
    }
 
    // Filter recipes again based on the updated selected ingredients
    filterRecipes();
 }


 function updatePantryList(ingredients) {
    const pantryList = document.querySelector('.pantry-list');
    pantryList.innerHTML = ''; // Clear existing pantry list

    ingredients.forEach((ingredient, index) => {
       const listItem = document.createElement('li');
       listItem.classList.add('pantry-item'); // Add class for pantry item
       listItem.textContent = `${ingredient}`;

       // Create button to remove ingredient
       const removeButton = document.createElement('button');
       removeButton.classList.add('remove-ingredient'); // Add class for remove button
       removeButton.style.float = 'right'; // Float right

       // Create icon element for trash icon
       const trashIcon = document.createElement('i');
       trashIcon.classList.add('bi', 'bi-trash'); // Add classes for trash icon
       trashIcon.setAttribute('aria-hidden', 'true');

       // Append trash icon to button
       removeButton.appendChild(trashIcon);

       removeButton.addEventListener('click', () => {
          removePantryItem(ingredient); // Call removePantryItem function
          toggleSelection(document.getElementById(ingredient)); // Remove from selected ingredients
       });

       // Append button to pantry item
       listItem.appendChild(removeButton);

       // Append pantry item to pantry list
       pantryList.appendChild(listItem);
    });
 }

// Function to remove selected ingredient from pantry items
function removePantryItem(ingredientName) {
   const pantryItems = document.querySelectorAll('.pantry-item');
   pantryItems.forEach((item) => {
      if (item.textContent === ingredientName) {
         item.remove();
      }
   });
}

function updatePantryCount(count) {
   const numOfIngredients = document.getElementById('num-of-ingredients');
   if (numOfIngredients) {
      numOfIngredients.textContent = count;
   }
}

function separateTime(cookTime) {
   let hours = 0;
   let minutes = 0;

   const timeParts = cookTime.split(' ');
   timeParts.forEach((part, index) => {
     if (part === 'hrs' || part === 'hr') {
       hours = parseInt(timeParts[index - 1]);
     } else if (part === 'mins') {
       minutes = parseInt(timeParts[index - 1]);
     }
   });

   return { hours, minutes };
 }


// Function to fetch recipes from the server
async function fetchRecipes() {
    try {
        const response = await fetch('/search-results'); 
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        const recipes = await response.json();
        return recipes;
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
 }

 function generateRecipeHTML(recipe) {
  // Extracting matched ingredients
  const selectedIngredients = getSelectedButtonIds();
  const matchedIngredients = recipe.ingredients.filter(ingredientObj => selectedIngredients.includes(ingredientObj.ingredient.name));
  const missingIngredients = recipe.ingredients.filter(ingredientObj => !selectedIngredients.includes(ingredientObj.ingredient.name));
  const totalIngredients = recipe.ingredients.length;

  // Check if there are matched ingredients
  const matchedIngredientsExist = selectedIngredients.length > 0 && matchedIngredients.length > 0;

  let recipeHtml = `
    <div class="recipe">
      <a href="/recipes/${recipe.slug}" style="text-decoration: none; color: black">
  `;

  recipe.reviews.forEach(review => {
    recipeHtml += `
        <div class="recipe-rating hidden" recipe-rating="${review.rating}">
          ${review.rating}
        </div>
    `;
  });

  recipeHtml += `
        <div class="recipe-img-container">
          <img class="recipe-img" src="${recipe.image}" />
        </div>
        <div class="first-row">
          <div class="recipe-name" title="${recipe.name}">
            ${recipe.name}
          </div>
          <form action="/favorite-recipe/add-favorite/${recipe.slug}" method="post">
  `;

  if (recipe.isBookmarked) {
    recipeHtml += `
            <button type="submit" class="bg-none border-0">
              <i class="ri-bookmark-fill" title="Add to favorites" style="color: rgb(220, 183, 89);"></i>
            </button>
    `;
  } else {
    recipeHtml += `
            <button type="submit" class="bg-none border-0">
              <i class="ri-bookmark-fill" style="color: rgb(53, 51, 46);"></i>
            </button>
    `;
  }

  recipeHtml += `
          </form>
        </div>
      </a>
  `;

  if (matchedIngredientsExist) {
    recipeHtml += `
      <div class="ingredient-match">
        <p>
          <strong>Matched Ingredients:</strong> ${matchedIngredients.length} / ${totalIngredients}
          <a class="view-details" style="cursor: pointer;">View Details</a>
        </p>
        <p>
          <strong>You have:</strong> ${matchedIngredients.map(ingredientObj => `${ingredientObj.ingredient.name}`).join(', ')}
        </p>
        <div class="details hidden">
          <p class="missing-ingredient"><strong>Missing Ingredients:</strong>
            ${missingIngredients.map(ingredientObj => `${ingredientObj.ingredient.name}`).join(', ')}
          </p>
        </div>
      </div>
    `;
  }

  recipeHtml += `
      <div class="second-row">
        <div class="cook-time">
          <img src="/images/clock.png" />
          <span>${recipe.time}</span>
        </div>
        <div class="rating">
          ${displayStars(recipe.reviews)}
        </div>
      </div>
    </div>
  `;

  // You can now use this recipeHtml string for further processing (e.g., inserting it into the DOM)
  return recipeHtml;
}

document.addEventListener('click', function(event) {
   // Check if the clicked element is a "View Details" link
   if (event.target.classList.contains('view-details')) {
       event.preventDefault();
       // Traverse the DOM to find the details container
       const detailsContainer = event.target.closest('.ingredient-match').querySelector('.details');
       if (detailsContainer) {
           detailsContainer.classList.toggle('hidden');
           event.target.textContent = detailsContainer.classList.contains('hidden') ? 'View Details' : 'Hide Details';
       }
   }
});
function displayStars(reviews) {
  let totalRating = 0;
  const numReviews = reviews.length;

  // Calculate total rating
  reviews.forEach(review => {
      totalRating += review.rating;
  });

  // Calculate average rating
  const averageRating = Math.round(totalRating / numReviews);

  let html = '';

  // Generate stars based on the average rating
  for (let i = 1; i <= 5; i++) {
      if (i <= averageRating) {
          html += '<i class="ri-heart-3-fill stars" style="color: #980201"></i>';
      } else {
          html += '<i class="ri-heart-3-fill stars" style="color: #d9d9d9"></i>';
      }
  }

  return html;
}

// Function to render recipes
function renderRecipes(recipes) {
    const resultsContainer = document.getElementById('all-recipes');
    resultsContainer.innerHTML = ''; // Clear existing recipes

    recipes.forEach(recipe => {
        const recipeHTML = generateRecipeHTML(recipe);
        resultsContainer.insertAdjacentHTML('beforeend', recipeHTML);
    });
}

// Display number of recipes can be make with selected ingredients
function updateRecipeCount(count) {
    const recipeCountElement = document.querySelector('.recipe-count');
    const selectedIngredients = getSelectedButtonIds();
    if (recipeCountElement) {
        if (selectedIngredients.length > 0) {
            recipeCountElement.innerHTML = `You can make <span id="num-of-recipes">${count}</span> recipes`;
            document.getElementById('totalRecipes').style.display = 'none';
        } else {
            recipeCountElement.innerHTML = ''; // Hide the message
            document.getElementById('totalRecipes').style.display = 'block';

        }
    }

}

async function filterRecipes() {
    try {
        // Fetch recipes data asynchronously
        const recipesData = await fetchRecipes();
        const recipes = recipesData.recipes; // Access the 'recipes' array from 'recipesData'

        // Get selected filter criteria
        const selectedIngredients = getSelectedButtonIds();
        const selectedCuisine = Array.from(document.querySelectorAll('input[name="cuisine"]:checked')).map(checkbox => checkbox.id);
        const selectedCookTime = Array.from(document.querySelectorAll('input[name="cookTime"]:checked')).map(checkbox => checkbox.id);

        // Filter recipes based on selected criteria
        let filteredRecipes = recipes.filter(recipe => {
            // Extract ingredients from the recipe object
            // const recipeIngredients = recipe.ingredients.map(ingredientObj => ingredientObj.ingredient.name);
            const recipeIngredients = recipe.ingredients.map(ingredientObj => ingredientObj.ingredient ? ingredientObj.ingredient.name : '');

            console.log(recipeIngredients);

            // Check if any selected ingredient is present in the recipe's ingredients
            const anyIngredientMatch = selectedIngredients.some(ingredient => recipeIngredients.includes(ingredient));

            // Check if cuisine matches
            const cuisineMatch = selectedCuisine.length === 0 || selectedCuisine.includes(recipe.cuisine.name);

            // Check if cook time matches
            let cookTimeMatch = false;
            if (selectedCookTime.length === 0) {
                cookTimeMatch = true; // No cook time selected, so all recipes match
            } else {
                // Extract hours and minutes from recipe's cook time
                const timeArray = separateTime(recipe.time);
                
                // Check if the recipe's cook time matches any of the selected options
                if (selectedCookTime.includes("over30") && (timeArray.hours > 0 || timeArray.minutes > 30)) {
                    cookTimeMatch = true;
                } else if (selectedCookTime.includes("under30") && timeArray.hours === 0 && timeArray.minutes > 15 && timeArray.minutes <= 30) {
                    cookTimeMatch = true;
                } else if (selectedCookTime.includes("under15") && timeArray.hours === 0 && timeArray.minutes <= 15) {
                    cookTimeMatch = true;
                }
            }

            return (anyIngredientMatch || selectedIngredients.length === 0) && cuisineMatch && cookTimeMatch;
        });

        // Sort filtered recipes based on the number of matched ingredients
        filteredRecipes.sort((a, b) => {
            const matchedIngredientsA = a.ingredients.filter(ingredientObj => selectedIngredients.includes(ingredientObj.ingredient.name)).length;
            const matchedIngredientsB = b.ingredients.filter(ingredientObj => selectedIngredients.includes(ingredientObj.ingredient.name)).length;
            return matchedIngredientsB - matchedIngredientsA; // Sort in descending order
        });

        // Render filtered and sorted recipes
        renderRecipes(filteredRecipes);

        // Update recipe count
        updateRecipeCount(filteredRecipes.length);
    } catch (error) {
        console.error('Error filtering recipes:', error);
    }
}







