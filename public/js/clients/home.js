let filterIcon = document.querySelector(".filter-icon-container");

let filterCriteria = document.querySelector(".filter-criteria");

let pantryIcon = document.querySelector(".pantry-icon");

let pantryContents = document.querySelector(".pantry-contents");

filterIcon.addEventListener("click", () => {
  filterCriteria.classList.toggle("show");
});

pantryIcon.addEventListener("click", () => {
  pantryIcon.classList.toggle("moveUp");
  pantryContents.classList.toggle("show");
});

// Function to toggle the selection state of the button
function toggleSelection(button) {
  button.classList.toggle("selected");
  let selectedIngredients = getSelectedButtonIds();
  let recipes = getRecipes();
  getRecipeByIngredient(selectedIngredients, recipes);
}

function getSelectedButtonIds() {
  const selectedButtons = document.querySelectorAll(
    ".selectable-button.selected"
  );

  const selectedIngredients = [];
  selectedButtons.forEach((button) => {
    selectedIngredients.push(button.id);
  });
  return selectedIngredients;
}

function getRecipes() {
  const recipes = [];
  document.querySelectorAll(".recipe").forEach((recipe) => {
    const recipeName = recipe.getAttribute("recipe-name");
    const recipeImg = recipe.getAttribute("recipe-img");
    const cookTime = recipe.getAttribute("cook-time");
    const recipeIngredients = [];
    recipe.querySelectorAll(".recipe-ingredients").forEach((ingredient) => {
      const ingredientName = ingredient.getAttribute("recipe-ingredient");
      recipeIngredients.push(ingredientName);
    });

    let recipeRating = 0;
    recipe.querySelectorAll(".recipe-rating").forEach((review) => {
      const rating = review.getAttribute("recipe-rating");
      recipeRating = rating;
    });
    recipes.push({
      recipeName,
      recipeImg,
      recipeIngredients,
      cookTime,
      recipeRating,
    });
  });
  return recipes;
}

function getRecipeByIngredient(selectedIngredients, recipes) {
  let anyRecipeShown = false; // Flag to track if any recipe is shown
  let matchingRecipesCount = 0; // Counter for matching recipes

  if (selectedIngredients.length === 0) {
    // If no ingredients are selected, remove content from p element
    const recipeCountElement = document.querySelector('.recipe-count');
    if (recipeCountElement) {
      recipeCountElement.innerHTML = "";
    }

    // Hide all recipes and remove content from the ingredient-match div
    recipes.forEach((recipe) => {
      const recipeElement = document.querySelector(`.recipe[recipe-name="${recipe.recipeName}"]`);
      if (recipeElement) {
        recipeElement.style.display = 'none'; // Hide the recipe
        
        // Remove the div indicating matched ingredients if it exists
        let ingredientMatchDiv = recipeElement.querySelector('.ingredient-match');
        if (ingredientMatchDiv) {
          ingredientMatchDiv.textContent = ""; // Remove content
        }
      }
    });
  } else {
    // If ingredients are selected, show only relevant recipes
    recipes.forEach((recipe) => {
      const hasSelectedIngredient = recipe.recipeIngredients.some(ingredient =>
        selectedIngredients.includes(ingredient)
      );
      const recipeElement = document.querySelector(`.recipe[recipe-name="${recipe.recipeName}"]`);
      if (recipeElement) {
        if (hasSelectedIngredient) {
          recipeElement.style.display = 'block'; // Show the recipe
          anyRecipeShown = true; // Set flag to true
          
          // Create or update the div indicating matched ingredients
          let ingredientMatchDiv = recipeElement.querySelector('.ingredient-match');
          if (!ingredientMatchDiv) {
            ingredientMatchDiv = document.createElement('p');
            ingredientMatchDiv.classList.add('ingredient-match');
            recipeElement.insertBefore(ingredientMatchDiv, recipeElement.querySelector('.second-row'));
          }
          // Update the content of the message div with relevant ingredients
          const relevantIngredients = selectedIngredients.filter(ingredient =>
            recipe.recipeIngredients.includes(ingredient)
          );
          ingredientMatchDiv.textContent = `You have: ${relevantIngredients.join(', ')}`;
          matchingRecipesCount++; // Increment matching recipe count
        } else {
          recipeElement.style.display = 'none'; // Hide the recipe
          
          // Remove the div indicating matched ingredients if it exists
          let ingredientMatchDiv = recipeElement.querySelector('.ingredient-match');
          if (ingredientMatchDiv) {
            ingredientMatchDiv.textContent = ""; // Remove content
          }
        }
      }
    });
  }

  // Update recipe count in the DOM if any recipe is shown
  if (anyRecipeShown) {
    const recipeCountElement = document.querySelector('.recipe-count');
    if (recipeCountElement) {
      recipeCountElement.innerHTML = `You can make <span id="num-of-recipes">${matchingRecipesCount}</span> recipes.`;
    }
  }
}


