const SignInController = {
  // Signin page for user
  getSignIn: (req, res) => {
    res.send("User authenticated page");
    // res.render("signin", { layout: null });
  },

  // Signin page for admin
  getAdminSignIn: (req, res) => {
    res.send("Admin authenticated page");

    // res.render("admin/signin", { layout: null });
  },
};

module.exports = SignInController;
