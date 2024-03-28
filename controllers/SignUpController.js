const User = require("../models/User");
const bcrypt = require("bcrypt");

const SignUpController = {
  // Signup page for user
  getSignUp: (req, res) => {
    console.log("Signup page for user");

    res.render("admins/signUp", { layout: './layouts/testing' });
  },

  postSignUp: async (req, res) => {
    try {
      const user = await User.create({
        ...req.body.trim(),
        role: false,
        password: await bcrypt.hash(password, 10),
      });
      if (!user) {
        console.log("An error occurred while signing up!");
        req.flash("error", "An error occurred while signing up!");
        res.redirect("/signup");
        return;
      }
      console.log("You have successfully signed up!");
      req.flash("success", "You have successfully signed up!");
      res.redirect("/signin");
    } catch (err) {
      console.log(err);
    }
  },

  // Signup page for admin
  getAdminSignUp: (req, res) => {
    console.log("Signup page for admin");
    res.render("admin/signup", { layout: null });
  },

  postAdminSignUp: async (req, res) => {
    try {
      const adminUser = await User.create({
        ...req.body.trim(),
        role: true,
        password: await bcrypt.hash(password, 10),
      });
      if (!adminUser) {
        console.log("An error occurred while signing up!");
        req.flash("error", "An error occurred while signing up!");
        res.redirect("/signup");
        return;
      }
      console.log("You have successfully signed up!");

      req.flash("success", "You have successfully signed up!");
      res.redirect("/signin");
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = SignUpController;
