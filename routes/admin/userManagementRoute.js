const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get("/", async(req,res) =>{
    const users = await User.find({});
    res.render("admins/userManagementPage", {layout: false, users});
});

module.exports = router;