const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/profileController");

router.post("/update/:id", profileController.updateUser);
router.post("/delete/:id", profileController.deleteUser);

module.exports = router;