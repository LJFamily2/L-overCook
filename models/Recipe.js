const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema } = mongoose;

const reviewSchema = Schema({
    user: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const recipeSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    ingredients: [{
        ingredient:{
            type: Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        quantity: String,
    }],
    cuisine: {
        type: Schema.Types.ObjectId,
        ref: 'Cuisine'
    },
    reviews: [reviewSchema],
    image: String,
    time: String,
    url: String,
    slug: {
        type: String,
        unique: true,
        required: true

    },
})

recipeSchema.virtual("averageRating").get(function() {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((acc, { rating }) => acc + rating, 0);
    return total / this.reviews.length;
});


recipeSchema.pre("validate", function (next) {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
  });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;