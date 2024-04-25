const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const signUpController = {
  // Signup page for user
  getSignUp: async (req, res) => {
    // res.send("Signup page for user")
    res.status(200).render("partials/signUp", { layout: './layouts/client/defaultLayout', userAuthentication: true, messages: req.flash(), isAdminSignUp: false});
  },

  postSignUp: async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Check for existed email
      const existedUser = await User.findOne({email});
      if(existedUser){
        req.flash("error", "Can't create account with this email!");
        res.status(404).redirect('/signup');
        return;
      };

      const user = await User.create({
        username: username.trim(),
        password: hashedPassword,
        email: email.trim(),
        avatar: '',
        role: false,
        otpVerify: false,
        token: uuidv4(),
      });

      if (!user) {
        req.flash("error", "An error occurred while signing up!");
        res.status(404).redirect("/signup");
        return;
      }
      req.flash("success", "You have successfully signed up!");
      res.status(201).redirect("/signin");
    } catch (err) {
      console.log(err);
    }
  },

  // Signup page for admin
  getAdminSignUp: (req, res) => {
    res.render("partials/signup", { layout: './layouts/client/defaultLayout', userAuthentication: true, messages: req.flash(), isAdminSignUp: true});
  },

  postAdminSignUp: async (req, res) => {
    try {
      const { username, password,email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check for existed email
      const existedUser = await User.findOne({email});
      if(existedUser){
        req.flash("error", "Can't create account with this email!");
        res.status(404).redirect('/signup/admin');
        return;
      };

      const adminUser = await User.create({
        username: username.trim(),
        password: hashedPassword,
        email: email.trim(),
        role: true,
        token: uuidv4(),
      });

      if (!adminUser) {
        req.flash("error", "An error occurred while signing up!");
        res.status(404).redirect("/signup/admin");
        return;
      }

      req.flash("success", "You have successfully signed up!");
      res.status(201).redirect("/signin/admin");
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = signUpController;
