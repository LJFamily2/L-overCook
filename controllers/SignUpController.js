const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const signUpController = {
  // Signup page for user
  getSignUp: async (req, res) => {
    // res.send("Signup page for user")
    res.render("partials/signUp", { layout: './layouts/client/defaultLayout', userAuthentication: true });
  },

  postSignUp: async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Check for existed email
      const existedUser = await User.findOne({email});
      if(existedUser){
        return res.status(400).send("Can't create account with this email!");
      };

      const user = await User.create({
        username: username.trim(),
        password: hashedPassword,
        email: email.trim(),
        role: false,
        token: uuidv4(),
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
      console.log(req.body);
      const { username, password,email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check for existed email
      const existedUser = await User.findOne({email});
      if(existedUser){
        return res.status(400).send("Can't create account with this email!");
      };

      const adminUser = await User.create({
        username: username.trim(),
        password: hashedPassword,
        email: email.trim(),
        role: true,
        token: uuidv4(),
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
