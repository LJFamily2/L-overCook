const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: Boolean,
  createAt: Date,
});

const UserModel = mongoose.model("Users", UserSchema);
module.exports = UserModel;
