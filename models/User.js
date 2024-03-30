const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: Boolean,
  createAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

const UserModel = mongoose.model("Users", userSchema);
module.exports = UserModel;
