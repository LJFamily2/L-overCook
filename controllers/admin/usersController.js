const User = require('../../models/User');
const Recipe = require('../../models/Recipe');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const deleteImageFile = async (image) => {
   try {
      await fs.unlink(path.join('public/uploadImages', image));
   } catch (err) {
      console.log('Error deleting image file:', err);
   }
};

const updateUser = async (req, res) => {
   try {
      const { id } = req.params;
      const { username, email, role, password } = req.body;

      let hashedPassword;
      if (password) {
         hashedPassword = await bcrypt.hash(password, 10);
      }

      const updateFields = {
         username,
         email,
         role,
         password: hashedPassword,
      };

      if (req.file) {
         const newAvatar = req.file.filename;
         if (existingUser.avatar) {
            await deleteImageFile(existingUser.avatar);
         }
         updateFields.avatar = newAvatar;
      }

      await User.findOneAndUpdate(
         { _id: id },
         { $set: updateFields },
         { new: true }
      );

      req.flash('success', 'User updated successfully');
      res.redirect(req.headers.referer);
   } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Internal server error');
   }
};

// Controller for deleting a user
const deleteUser = async (req, res) => {
   try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
         req.flash('error', 'User not found');
         return res.status(404);
      }
      if (deletedUser.avatar) {
         try {
            await deleteImageFile(deletedUser.avatar);
         } catch (err) {
            console.log('Error deleting avatar file:', err);
         }
      }
      await Recipe.updateMany(
         {},
         { $pull: { reviews: { user: userId } } },
         { multi: true }
      );
      req.flash('success', 'User deleted successfully');
      const referer = req.headers.referer;
      res.redirect(referer);
   } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500);
   }
};

const logout = async (req, res) => {
   req.logout((err) => {
      if (err) {
         console.log(err);
      }
   });
   req.flash('success', 'You have successfully logged out!');
   res.redirect('/signin');
};

module.exports = { updateUser, deleteUser, logout };
