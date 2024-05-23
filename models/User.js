const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
  email: String,
  role: Boolean,
  token: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
  searchHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  }],
  favoriteRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  }],
  otp: {
    type: String, 
    default: null,
  },
  otpTimestamp: {
    type: Date,
    default: null,
  },
  otpRequestTimestamp:{
    type: Date,
    default: null,
  },
  otpVerify: Boolean,
});

userSchema.methods.getFormattedDateTime = function () {
  const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };

  // Check if createdAt field is defined
  if (this.createdAt) {
    const formattedDate = this.createdAt.toLocaleDateString(
      "en-GB",
      dateOptions
    );
    const formattedTime = this.createdAt.toLocaleTimeString(
      "en-US",
      timeOptions
    );
    return `${formattedDate}\n ${formattedTime}`;
  } else {
    return "";
  }
};

const UserModel = mongoose.model("Users", userSchema);


module.exports = UserModel;
