const express = require("express");
const router = express.Router();
const favoriteRecipeController = require("../../controllers/client/favoriteRecipeController");
const connectEnsureLogin = require('connect-ensure-login');

router.get("/",connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin'}), favoriteRecipeController.getFavoriteRecipePage);
router.post("/add-favorite/:slug",connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin'}),favoriteRecipeController.addFavorite);
router.post("/delete-favorite/:slug",favoriteRecipeController.deleteFavorite);

module.exports = router;
