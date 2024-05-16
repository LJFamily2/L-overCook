const express = require("express");
const router = express.Router();
const searchHistoryController = require("../../controllers//client/searchHistoryController");
const connectEnsureLogin = require('connect-ensure-login');

router.get("/",connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin'}), searchHistoryController.getSearchHistory);
router.post("/deleteHistory/:slug", searchHistoryController.deleteSearchHistory);

module.exports = router;
