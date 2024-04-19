const signInController = {
  // Signin page for user
  getSignIn: (req, res) => {
    res.render("partials/signIn", {  layout: './layouts/client/defaultLayout', userAuthentication: true });
  },

  // Signin page for admin
  getAdminSignIn: (req, res) => {
    res.send("Admin authenticated page");

    // res.render("admin/signin", { layout: null });
  },
};

module.exports = signInController;
