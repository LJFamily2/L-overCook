const express = require("express");
const router = express.Router();
const signInController = require("../../controllers/client/favoriteRecipeController");
const favoriteRecipeController = require("../../controllers/client/favoriteRecipeController");

router.get("/", favoriteRecipeController.getFavoriteRecipe);
router.post("/addFavorite/:slug",);
router.post("/deleteFavorite/:slug",);

module.exports = router;
