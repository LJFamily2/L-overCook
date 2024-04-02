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
  searchHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  },
  favoriteRecipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  },
});

const UserModel = mongoose.model("Users", userSchema);
module.exports = UserModel;
