

//Define schema
const cuisineSchema = new mongoose.Schema({

});

//Define model based on schema
const Cuisine = mongoose.model('Cuisine', cuisineSchema);

//Export module for use in other parts
module.exports = Cuisine;