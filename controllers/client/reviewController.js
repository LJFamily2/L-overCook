const Recipe = require('../../models/Recipe');
userHasReviewed = async (slug, userId) => {
    try {
       const recipe = await Recipe.findOne({ slug }).populate('reviews.user');
       if (!recipe) {
          return false;
       }

       return recipe.reviews.some((review) => review.user && review.user._id.equals(userId));
    } catch (error) {
       console.error(error);
       return false;
    }
 }

const reviewController = {

addReview: async (req, res) => {
    try {
        const slug = req.params.slug;
        const { rating, review } = req.body;
        const user = req.user; 

        const hasReviewed = await userHasReviewed(slug, user._id);

        if (hasReviewed) {
            // User has already reviewed, update the review
            await Recipe.updateOne(
                { slug, 'reviews.user': user._id },
                {
                    $set: {
                        'reviews.$.review': review,
                        'reviews.$.rating': parseInt(rating) || 1,
                    },
                }
            );
        } else {
            // User has not reviewed, add a new review
            const newReview = {
                user: user._id,
                review,
                rating: parseInt(rating) || 1,
            };

            await Recipe.updateOne({ slug }, { $push: { reviews: newReview } });
        }

        const referer = req.headers.referer;
        res.redirect(referer + '#comments');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
},


   removeReview: async (req, res) => {
    console.log(req.body)
      try {
         const { slug, reviewId } = req.params;

         // Find the recipe by slug
         const recipe = await Recipe.findOne({ slug });
         if (!recipe) {
            return res.status(404).send('Recipe not found');
         }

         // Find the index of the review to remove
         const index = recipe.reviews.findIndex(
            (review) => review._id === reviewId
         );
         if (index === -1) {
            return res.status(404).send('Review not found');
         }

         // Remove the review from the array
         recipe.reviews.splice(index, 1);
         await recipe.save();

         res.send('Review removed successfully');
      } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
      }
   },
};

module.exports = reviewController;
