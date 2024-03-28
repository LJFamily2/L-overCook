const User = require("../models/User");

const SignUpController = {
  // Signup page for user
  getSignUp: (req, res) => {
    res.render("signup", { layout: null });
  },

  postSignUp: async (req, res) => {
    try {
      const user = await User.create({ ...req.body, role: false });
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
    res.render("admin/signup", { layout: null });
  },

  postAdminSignUp: async (req, res) => {
    try {
      const adminUser = await User.create({ ...req.body, role: true });
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
