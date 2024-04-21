const signInController = {
  // Signin page for user
  getSignIn: (req, res) => {
    res.render("partials/signIn", {  layout: './layouts/client/defaultLayout', userAuthentication: true, isAdminSignUp: false, messages: req.flash() });
  },

  // Signin page for admin
  getAdminSignIn: (req, res) => {
    res.render("partials/signIn", {  layout: './layouts/client/defaultLayout', userAuthentication: true, isAdminSignUp: true, messages: req.flash() });
  },
};

module.exports = signInController;
