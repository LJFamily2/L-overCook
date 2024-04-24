const express = require("express");
const router = express.Router();
const favoriteRecipeController = require("../../controllers/client/favoriteRecipeController");

router.get("/", favoriteRecipeController.getFavoriteRecipe);
router.post("/add-favorite/:slug",favoriteRecipeController.addFavorite);
router.post("/delete-favorite/:slug",favoriteRecipeController.deleteFavorite);

module.exports = router;
