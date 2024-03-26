const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../models/User.js");

export function initialize(passport) {
  const authenticater = async (username, password, done) => {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "User is not exist" });
    }
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Invalid username or password" });
    }
  };

  passport.use(new LocalStrategy({ usernameField: "username" }, authenticater));

  // serialize and deserialize are used to store the user in the session
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    return done(null, await UserModel.findById(id));
  });
}
