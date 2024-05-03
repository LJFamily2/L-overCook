let filterIcon = document.querySelector('.filter-icon-container');

let filterCriteria = document.querySelector('.filter-criteria');


filterIcon.addEventListener('click', () => {
   filterCriteria.classList.toggle('hidden');
   filterCriteria.classList.toggle('show');
});


// Function to toggle selection state of the button and update pantry items
function toggleSelection(button) {
   button.classList.toggle('selected');
   const selectedIngredients = getSelectedButtonIds();
   const recipes = getRecipes();
   getRecipeByIngredient(selectedIngredients, recipes);

   // Update pantry items based on selected ingredients
   updatePantryList(selectedIngredients);

   // Update the number of ingredients displayed in the pantry icon
   updatePantryCount(selectedIngredients.length);

   // Update active status of ingredient in search bar
   const ingredientId = button.id;
const activeStatus = document.querySelector(`.active-status#${CSS.escape(ingredientId)}`);

   console.log(activeStatus)
   if (button.classList.contains('selected')) {
      activeStatus.textContent = '-';
   } else {
      activeStatus.textContent = '+';
   }
}

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

function getRecipes() {
   const recipes = [];
   document.querySelectorAll('.recipe').forEach((recipe) => {
      const recipeName = recipe.getAttribute('recipe-name');
      const recipeImg = recipe.getAttribute('recipe-img');
      const recipeCuisine = recipe.getAttribute('recipe-cuisine');
      const cookTime = recipe.getAttribute('cook-time');
      const recipeIngredients = [];
      recipe.querySelectorAll('.recipe-ingredients').forEach((ingredient) => {
         const ingredientName = ingredient.getAttribute('recipe-ingredient');
         recipeIngredients.push(ingredientName);
      });

      let recipeRating = 0;
      recipe.querySelectorAll('.recipe-rating').forEach((review) => {
         const rating = review.getAttribute('recipe-rating');
         recipeRating = rating;
      });
      recipes.push({
         recipeName,
         recipeImg,
         recipeIngredients,
         recipeCuisine,
         cookTime,
         recipeRating,
      });
   });
   return recipes;
}
function clearRecipeDisplay(recipes) {
   const recipeCountElement = document.querySelector('.recipe-count');
   if (recipeCountElement) {
      recipeCountElement.innerHTML = '';
   }

   // Hide all recipes and remove content from the ingredient-match div
   recipes.forEach((recipe) => {
      const recipeElement = document.querySelector(
         `.recipe[recipe-name="${recipe.recipeName}"]`
      );
      if (recipeElement) {
         recipeElement.style.display = 'none'; // Hide the recipe

         // Remove the div indicating matched ingredients if it exists
         let ingredientMatchDiv =
            recipeElement.querySelector('.ingredient-match');
         if (ingredientMatchDiv) {
            ingredientMatchDiv.textContent = ''; // Remove content
         }
      }
   });
}
function showMatchingRecipes(recipes, selectedIngredients) {
   let matchingRecipesCount = 0; // Counter for matching recipes

   recipes.forEach((recipe) => {
      const hasSelectedIngredient = recipe.recipeIngredients.some(
         (ingredient) => selectedIngredients.includes(ingredient)
      );
      const recipeElement = document.querySelector(
         `.recipe[recipe-name="${recipe.recipeName}"]`
      );
      if (recipeElement) {
         if (hasSelectedIngredient) {
            showRecipe(recipeElement, recipe, selectedIngredients);
            matchingRecipesCount++;
         } else {
            hideRecipe(recipeElement);
         }
      }
   });

   return matchingRecipesCount;
}

function showRecipe(recipeElement, recipe, selectedIngredients) {
   recipeElement.style.display = 'block'; // Show the recipe

   // Create or update the div indicating matched ingredients and missing ingredients
   let ingredientMatchDiv = recipeElement.querySelector('.ingredient-match');
   if (!ingredientMatchDiv) {
      ingredientMatchDiv = document.createElement('p');
      ingredientMatchDiv.classList.add('ingredient-match');
      recipeElement.insertBefore(
         ingredientMatchDiv,
         recipeElement.querySelector('.second-row')
      );
   }

   // Update the content of the message div with relevant and missing ingredients
   const relevantIngredients = selectedIngredients.filter((ingredient) =>
      recipe.recipeIngredients.includes(ingredient)
   );
   const missingIngredients = recipe.recipeIngredients.filter(
      (ingredient) => !selectedIngredients.includes(ingredient)
   );

   let ingredientMatchContent = '';

   if (missingIngredients.length === 0) {
      ingredientMatchContent = 'You have all ingredients!';
   } else {
      ingredientMatchContent = `You have: ${relevantIngredients.join(
         ', '
      )}.<span class="missing-ingredient"><br>Missing: ${missingIngredients.join(
         ', '
      )}</span>`;
   }

   ingredientMatchDiv.innerHTML = ingredientMatchContent;
}

function hideRecipe(recipeElement) {
   recipeElement.style.display = 'none'; // Hide the recipe

   // Remove the div indicating matched ingredients if it exists
   let ingredientMatchDiv = recipeElement.querySelector('.ingredient-match');
   if (ingredientMatchDiv) {
      ingredientMatchDiv.textContent = ''; // Remove content
   }
}

function updateRecipeCount(anyRecipeShown, matchingRecipesCount) {
   if (anyRecipeShown) {
      const recipeCountElement = document.querySelector('.recipe-count');
      if (recipeCountElement) {
         recipeCountElement.innerHTML = `You can make <span id="num-of-recipes">${matchingRecipesCount}</span> recipes.`;
      }
   }
}

function getRecipeByIngredient(selectedIngredients, recipes) {
   if (selectedIngredients.length === 0) {
      clearRecipeDisplay(recipes);
      updateRecipeCount(false, 0);
      updatePantryList([]);
      updatePantryCount(0);
   } else {
      const matchingRecipesCount = showMatchingRecipes(
         recipes,
         selectedIngredients
      );
      updateRecipeCount(matchingRecipesCount > 0, matchingRecipesCount);
      updatePantryList(selectedIngredients);
      updatePantryCount(selectedIngredients.length);
   }
}

function updatePantryList(ingredients) {
   const pantryList = document.querySelector('.pantry-list');
   pantryList.innerHTML = ''; // Clear existing pantry list

   ingredients.forEach((ingredient, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${ingredient}`;
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

function filterByCuisines() {
   const selectedCuisines = Array.from(document.querySelectorAll('.filter-criteria input[name="cuisine"]:checked')).map(cuisine => cuisine.id);
   const recipes = getRecipes();
   
   recipes.forEach(recipe => {
      console.log(recipe.recipeCuisine)
      const recipeElement = document.querySelector(`.recipe[recipe-name="${recipe.recipeName}"]`);
      if (recipeElement) {
         if (selectedCuisines.length === 0 || selectedCuisines.includes(recipe.recipeCuisine)) {
            recipeElement.style.display = 'block';
         } else {
            recipeElement.style.display = 'none';
         }
      }
   });
}

function filterByCookTime() {
   const selectedCookTime = Array.from(document.querySelectorAll('input[name="cookTime"]:checked')).map(checkbox => checkbox.id);
   const recipes = getRecipes();
   console.log(selectedCookTime);
 
   recipes.forEach(recipe => {
      const recipeElement = document.querySelector(`.recipe[recipe-name="${recipe.recipeName}"]`);
      const timeArray = separateTime(recipe.cookTime);
      console.log(timeArray);

      if (selectedCookTime.includes("over30") && (timeArray.hours > 0 || timeArray.minutes > 30)) {
         recipeElement.style.display = 'block';
      }
      else if (selectedCookTime.includes("under30") && timeArray.hours == 0 && timeArray.minutes > 15 && timeArray.minutes <= 30) {
         recipeElement.style.display = 'block';
      } 
      else if (selectedCookTime.includes("under15") && timeArray.hours == 0 && timeArray.minutes <= 15) {
         recipeElement.style.display = 'block';
      }
      else{ 
         recipeElement.style.display = 'none';
      }
   });
 }

 function separateTime(cookTime) {
   let hours = 0;
   let minutes = 0;
 
   const timeParts = cookTime.split(' ');
   timeParts.forEach((part, index) => {
     if (part === 'hrs') {
       hours = parseInt(timeParts[index - 1]);
     } else if (part === 'mins') {
       minutes = parseInt(timeParts[index - 1]);
     }
   });
 
   return { hours, minutes };
 }
