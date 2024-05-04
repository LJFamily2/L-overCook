const mongoose = require('mongoose');
const Category = require('../Category');
const Ingredient = require('../Ingredient');
const Cuisine = require('../Cuisine');
const Recipe = require('../Recipe');
const fs = require('fs').promises;

// Connect to MongoDB
mongoose.connect('mongodb+srv://hantran:LoverCookPassword@lovercook.i9gijho.mongodb.net/loverCook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to seed categories
async function seedCategories() {
  const categoriesData = [
    { name: 'Vegetables' },
    { name: 'Herb & Spice' },
    { name: 'Meat' },
    { name: 'Liquid' },
    { name: 'Oil' },
    { name: 'Seafood' },
    { name: 'Fruit' },
    { name: 'Condiment' },
    { name: 'Grains' },
    { name: 'Noodles' },
    { name: 'Dairy' },
    { name: 'Wrapper' },
    { name: 'N/A' },

  ];

  try {
    await Category.deleteMany();
    await Category.insertMany(categoriesData);
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

// Function to seed ingredients
async function seedIngredients() {
  try {
    await Ingredient.deleteMany();

    // Read ingredients data from JSON file
    const ingredientsData = await fs.readFile('ingredientsSeed.json', 'utf8');
    const ingredients = JSON.parse(ingredientsData);

    const categoriesMap = new Map((await Category.find()).map(cat => [cat.name, cat._id]));

    // Map category names to their corresponding ObjectId
    const ingredientsWithCategory = ingredients.map(ingredient => ({
      ...ingredient,
      category: categoriesMap.get(ingredient.category),
    }));

    // Insert ingredients with categories into the database
    await Ingredient.insertMany(ingredientsWithCategory);
    console.log('Ingredients seeded successfully');
  } catch (error) {
    console.error('Error seeding ingredients:', error);
  }
}

// Function to seed cuisines
async function seedCuisines() {
  const cuisinesData = [
    { name: 'Malaysian' },
    { name: 'Vietnamese' },
    { name: 'Filipino' },
    { name: 'Indonesian' },
    { name: 'Thai' },
  ];

  try {
    await Cuisine.deleteMany();
    await Cuisine.insertMany(cuisinesData);
    console.log('Cuisines seeded successfully');
  } catch (error) {
    console.error('Error seeding cuisines:', error);
  }
}

// Function to seed recipes
async function seedRecipes() {
  try {
    // Read recipes data from JSON file
    
    // const recipesData = await fs.readFile('recipesSeed-1.json', 'utf8');
    const recipesData = await fs.readFile('recipesSeed-2.json', 'utf8');
    const recipes = JSON.parse(recipesData);

    const existingRecipes = await Recipe.find();
    const existingRecipeNames = existingRecipes.map(recipe => recipe.name);
    const newRecipesData = recipes.filter(recipe => !existingRecipeNames.includes(recipe.name));

    if (newRecipesData.length > 0) {
      const categoriesMap = new Map((await Category.find()).map(cat => [cat.name, cat._id]));
      const ingredientsMap = new Map((await Ingredient.find()).map(ing => [ing.name, ing._id]));
      const cuisinesMap = new Map((await Cuisine.find()).map(cuisine => [cuisine.name, cuisine._id]));

      const recipesWithReferences = newRecipesData.map(recipe => ({
        ...recipe,
        ingredients: recipe.ingredients.map(ingredient => ({
          ingredient: ingredientsMap.get(ingredient.name),
          quantity: ingredient.quantity,
        })),
        cuisine: cuisinesMap.get(recipe.cuisine),
      }));

      await Recipe.insertMany(recipesWithReferences);
      console.log('New recipes seeded successfully');
    } else {
      console.log('No new recipes to seed');
    }
  } catch (error) {
    console.error('Error seeding recipes:', error);
  }
}


// Seed the database incrementally
async function seedDatabase() {
  // await seedCategories();
  // await seedIngredients();
  // await seedCuisines();
  await seedRecipes();
  mongoose.connection.close();
}

// Seed the database
seedDatabase();
