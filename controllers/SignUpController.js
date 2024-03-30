const User = require("../models/User");
const bcrypt = require("bcrypt");

const signUpController = {
  // Signup page for user
  getSignUp: (req, res) => {
    res.send("Signup page for user")
    // res.render("admins/signUp", { layout: './layouts/testing' });
  },

  postSignUp: async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        username: username.trim(),
        password: hashedPassword,
        email: email.trim(),
        role: false,
      });

      if (!user) {
        res.send('An error occurred while signing up!')
        req.flash("error", "An error occurred while signing up!");
        res.redirect("/signup");
        return;
      }
      res.send("You have successfully signed up!")
      req.flash("success", "You have successfully signed up!");
      res.redirect("/signin");
    } catch (err) {
      console.log(err);
    }
  },

  // Signup page for admin
  getAdminSignUp: (req, res) => {
    res.send("Signup page for admin")
    res.render("admin/signup", { layout: null });
  },

  postAdminSignUp: async (req, res) => {
    try {
      const { username, password,email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const adminUser = await User.create({
        username: username.trim(),
        password: hashedPassword,
        email: email.trim(),
        role: true,
      });

      if (!adminUser) {
        res.send("An error occurred while signing up!")
        req.flash("error", "An error occurred while signing up!");
        res.redirect("/signup");
        return;
      }
      res.send("You have successfully signed up!")
      req.flash("success", "You have successfully signed up!");
      res.redirect("/signin");
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = signUpController;
