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
   // const recipes = getRecipes();
   // getRecipeByIngredient(selectedIngredients, recipes);

   // Update pantry items based on selected ingredients
   updatePantryList(selectedIngredients);

   // Update the number of ingredients displayed in the pantry icon
   updatePantryCount(selectedIngredients.length);

   // Update active status of ingredient in search bar
   const ingredientId = button.id;
   const activeStatus = document.querySelector(`.active-status#${CSS.escape(ingredientId)}`);

   // console.log(activeStatus)
   if (button.classList.contains('selected')) {
      activeStatus.textContent = '-';
   } else {
      activeStatus.textContent = '+';
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

function separateTime(cookTime) {
   let hours = 0;
   let minutes = 0;
 
   const timeParts = cookTime.split(' ');
   timeParts.forEach((part, index) => {
     if (part === 'hrs' || 'hr') {
       hours = parseInt(timeParts[index - 1]);
     } else if (part === 'mins') {
       minutes = parseInt(timeParts[index - 1]);
     }
   });
 
   return { hours, minutes };
 }


function filterRecipes() {
   const selectedCuisines = Array.from(document.querySelectorAll('.filter-criteria input[name="cuisine"]:checked')).map(cuisine => cuisine.id);
   const selectedCookTimes = Array.from(document.querySelectorAll('input[name="cookTime"]:checked')).map(checkbox => checkbox.id);
   const selectedIngredients = getSelectedButtonIds();

   const recipes = getRecipes();

   recipes.forEach(recipe => {
      const recipeElement = document.querySelector(`.recipe[recipe-name="${recipe.recipeName}"]`);
      const timeArray = separateTime(recipe.cookTime);
      const hasSelectedCuisine = selectedCuisines.length === 0 || selectedCuisines.includes(recipe.recipeCuisine);
      const hasSelectedCookTime = selectedCookTimes.length === 0 ||
         (selectedCookTimes.includes("over30") && (timeArray.hours > 0 || timeArray.minutes > 30)) ||
         (selectedCookTimes.includes("under30") && timeArray.hours == 0 && timeArray.minutes > 15 && timeArray.minutes <= 30) ||
         (selectedCookTimes.includes("under15") && timeArray.hours == 0 && timeArray.minutes <= 15);
      const hasSelectedIngredients = selectedIngredients.length === 0 ||
         recipe.recipeIngredients.some(ingredient => selectedIngredients.includes(ingredient));

      if (recipeElement && hasSelectedCuisine && hasSelectedCookTime && hasSelectedIngredients) {
         recipeElement.style.display = 'block';
      } else {
         recipeElement.style.display = 'none';
      }
   });
}

// function filterRecipes() {
//    let selectedIngredients = getSelectedButtonIds();
//    console.log(selectedIngredients);
   
//    let selectedCuisine = [];
//    document.querySelectorAll('.cuisineCheckBoxes:checked').forEach(checkbox => {
//       selectedCuisine.push(checkbox.id);
//    });
//    console.log(selectedCuisine);

//    let selectedCookTime = [];
//    document.querySelectorAll('.timeCheckBoxes:checked').forEach(checkbox => {
//       selectedCookTime.push(checkbox.id);
//    });
//    console.log(selectedCookTime);

//    const recipes = getRecipes();

//    let results = [];
   
//    recipes.forEach(recipe => {
//       // Check if recipe contains any of the selected ingredients
//       let matchesIngredient = recipe.recipeIngredients.some(
//          (ingredient) => selectedIngredients.includes(ingredient)
//       );
      
      
      
//       // If recipe meets all criteria, push it to the result array
//       if (matchesIngredient && matchesCuisine && matchesCookTime) {
//          results.push(recipe);
//       }
//    });

//    console.log(results)
//    // Display results and hide any recipes not in result
//    displayRecipes(results);
// }

// function displayRecipes(recipes) {
//    // Assuming you have a function to display recipes
//    // Iterate through all recipes and display/hide them based on the result
//    const allRecipes = document.querySelectorAll('.recipe');
//    allRecipes.forEach(recipe => {
//       if (recipes.includes(recipe)) {
//          recipe.style.display = 'block'; // Show recipe
//       } else {
//          recipe.style.display = 'none'; // Hide recipe
//       }
//    });
// }