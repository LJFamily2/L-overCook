const User = require("../models/User");
const bcrypt = require("bcrypt");

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      req.flash("error", "User not found");
      return res.status(404).send("User not found");
    }
    const { username, email, role, password } = req.body;
    let updateFields = {
      username: username || existingUser.username,
      email: email || existingUser.email,
      role: role || existingUser.role,
    };
    

    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashPassword;
    } else {
      updateFields.password = existingUser.password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if(!updatedUser) {
      req.flash("error", "Error updating user");
      return res.status(500).send("Error updating user");
    }
    req.flash("success", "User updated successfully");
    res.redirect("/userManagement");
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal server error");
  }
};

// Controller for deleting a user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      req.flash("error", "User not found");
      return res.status(404);
    }
    return res.send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500);
  }
};

module.exports = { updateUser, deleteUser };
