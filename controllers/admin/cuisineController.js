const Cuisine = require('../../models/Cuisine');
const Recipe = require('../../models/Recipe');


// Get all cuisines
exports.getAllCuisines = async(req, res) => {
    try{
        const cuisines = await Cuisine.find();
        return cuisines;
    }catch(error){
        throw new Error(error.message);
    }
}

// Get ingredient page
exports.getCuisinePage = async (req,res) => {
    try{
        const rowsPerPage = parseInt(req.query.rows) || 20;
        const page = parseInt(req.query.page) || 1;
        const limit = rowsPerPage; 
        const skip = (page - 1) * limit;
        const cuisines = await Cuisine.find().skip(skip).limit(limit);
        const totalCuisine = await Cuisine.countDocuments();
        res.render('admin/cuisineManagementPage', {
            cuisines, 
            layout: "./layouts/admin/defaultLayout", 
            currentPage: 'cuisine-management',
            heading: 'Cuisine Management',
            totalPages: Math.ceil(totalCuisine / limit), 
            currentPageNumber: page,
            rowsPerPage: rowsPerPage,
            searchPage: false,
            pageName: 'cuisines',
  
        });
    }catch(error){
        throw new Error(error.message);
    }
};


// search cuisine
exports.searchCuisine = async (req, res) => {
    try {
       const searchTerm = req.query.searchTerm;
       const rowsPerPage = parseInt(req.query.rows) || 5;
       const page = parseInt(req.query.page) || 1;
       const limit = rowsPerPage;
       const skip = (page - 1) * limit;
 
       const cuisineQuery = Cuisine.find({
          name: { $regex: searchTerm, $options: 'i' },
       });
 
       const totalCuisines = await Cuisine.countDocuments({
          name: { $regex: searchTerm, $options: 'i' },
       });
 
       const cuisines = await cuisineQuery
          .skip(skip)
          .limit(limit)
          .exec();
 
       res.render('admin/searchManagementPage', {
          cuisines,
          layout: './layouts/admin/defaultLayout',
          currentPage: 'cuisine-management',
          heading: 'Cuisine Management',
          totalPages: Math.ceil(totalCuisines / limit),
          currentPageNumber: page,
          rowsPerPage,
          message: req.flash(),
          searchPage: true,
          searchTerm,
          pageName: 'cuisines',
 
       });
    } catch (error) {
       console.log(error);
    }
 };
 

// Create new cuisine
exports.createCuisine = async (req, res) => {
    const { name } = req.body;

    try {
        // Check if category already exists
        const existingCuisine = await Cuisine.findOne({ name });
        if (existingCuisine) {
            throw new Error('Failed to add item: Cuisine already exists');
        }

        // Create new category instance with a new ObjectId
        const cuisine = new Cuisine({
            name,
        });

        // Save the new category
        const newCuisine = await cuisine.save();
        res.redirect('/cuisines?success=Cuisine+added+successfully');
    } catch (error) {
        res.redirect('/cuisines?error=true&message=' + encodeURIComponent(error.message));

    }
};


// Delete existing cuisine
exports.deleteCuisine = async (req,res) => {
    const cuisineId = req.params.id;
    console.log(cuisineId)
    try{        
        // Update recipes associated with the deleted cuisine
        await Recipe.updateMany(
            {cuisine: cuisineId},
            { $unset: { cuisine: '' } }
        );
        
        // Delete cuisine
        await Cuisine.deleteOne({ _id: cuisineId });
        res.redirect('/cuisines?success=Cuisine+deleted+successfully');
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// Update cuisine
exports.updateCuisine = async (req, res) => {
    const cuisineId = req.params.id;
    const { name } = req.body;
    try {
        // Check if id existed
        const cuisine = await Cuisine.findById(cuisineId);
        if(!cuisine){
            throw new Error('Failed to update item: Cuisine not found.')
        }

        // Check if name existed
        const updatedCuisine = await Cuisine.findOne({ name });

        // Throw error if cuisine name already existed
        if(updatedCuisine){
            throw new Error(`Failed to update item: Cuisine with name '${name}' already exists`);
        }
        
        await Cuisine.findByIdAndUpdate(cuisineId, { name }, { new: true });
        res.redirect('/cuisines?success=Cuisine+updated+successfully');
        
    } catch (error) {
        res.redirect('/cuisines?error=true&message=' + encodeURIComponent(error.message));        
    }
}

