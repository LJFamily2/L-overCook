const express = require("express");
const router = express.Router();
const searchHistoryController = require("../../controllers/searchHistoryController");

router.get("/", searchHistoryController.getSearchHistory);
router.post("/addHistory/:slug", searchHistoryController.addSearchHistory);
router.post("/deleteHistory/:slug", searchHistoryController.deleteSearchHistory);

module.exports = router;
