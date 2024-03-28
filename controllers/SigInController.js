
const SignInController = {
    // Signin page for user
    getSignIn: (req, res) => {
        res.render("signin", { layout: null });
        console.log("Signin page for user");
    },


    // Signin page for admin
    getAdminSignIn: (req, res) => {
        res.render("admin/signin", { layout: null });
        console.log("Signin page for admin");
    },


};

module.exports = SignInController;