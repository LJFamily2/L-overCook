const mongoose = require('mongoose');
const Recipe = require('../Recipe');

// Define MongoDB connection URL
const MONGODB_URI = 'mongodb+srv://hantran:LoverCookPassword@lovercook.i9gijho.mongodb.net/loverCook';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Create sample recipes
        const recipes = [
            {
                name: 'Spaghetti Carbonara',
                ingredients: [
                    { ingredient: 'Spaghetti', quantity: 200 },
                    { ingredient: 'Bacon', quantity: 100 },
                    { ingredient: 'Egg', quantity: 2 },
                    { ingredient: 'Parmesan cheese', quantity: 50 },
                    { ingredient: 'Black pepper', quantity: 'To taste' }
                ],
                description: 'Classic Italian pasta dish with bacon, eggs, and cheese.',
                cuisine: 'Italian',
                image: 'https://example.com/spaghetti_carbonara.jpg',
                time: '30 minutes',
                url: 'https://example.com/spaghetti_carbonara_recipe'
            },
            {
                name: 'Chicken Tikka Masala',
                ingredients: [
                    { ingredient: 'Chicken breast', quantity: 500 },
                    { ingredient: 'Yogurt', quantity: 200 },
                    { ingredient: 'Tomato sauce', quantity: 400 },
                    { ingredient: 'Onion', quantity: 1 },
                    { ingredient: 'Garlic', quantity: 2 },
                    { ingredient: 'Ginger', quantity: '1-inch piece' },
                    { ingredient: 'Garam masala', quantity: 'To taste' },
                    { ingredient: 'Salt', quantity: 'To taste' }
                ],
                description: 'Popular Indian dish featuring marinated chicken in a spiced tomato sauce.',
                cuisine: 'Indian',
                image: 'https://example.com/chicken_tikka_masala.jpg',
                time: '1 hour',
                url: 'https://example.com/chicken_tikka_masala_recipe'
            }
            // Add more sample recipes as needed
        ];

        // Insert sample recipes into the database
        Recipe.insertMany(recipes)
            .then((insertedRecipes) => {
                console.log('Sample recipes inserted successfully:', insertedRecipes);
                mongoose.disconnect(); // Disconnect from MongoDB
            })
            .catch((error) => {
                console.error('Error inserting sample recipes:', error);
                mongoose.disconnect(); // Disconnect from MongoDB
            });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
