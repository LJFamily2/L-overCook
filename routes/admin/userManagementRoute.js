const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const userManagementController = require("../../controllers/userManagementController");

router.get("/", async(req,res) =>{
    const users = await User.find({});
    res.render("admin/userManagementPage", {layout: './layouts/admin/defaultLayout', users, heading: "User Management"});
});
router.post("/update/:id", userManagementController.updateUser);
router.post("/delete/:id", userManagementController.deleteUser);

module.exports = router;