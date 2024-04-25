const User = require('../../models/User');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const deleteImageFile = async (imagePath) => {
   try {
      await fs.unlink(imagePath);
   } catch (err) {
      console.log('Error deleting image file:', err);
   }
};

const updateUser = async (req, res) => {
   try {
      const userId = req.params.id;
      const existingUser = await User.findById(userId);

      if (!existingUser) {
         req.flash('error', 'User not found');
         return res.status(404).send('User not found');
      }

      const { username, email, role } = req.body;
      const updateFields = {
         username: username || existingUser.username,
         email: email || existingUser.email,
         role: role || existingUser.role,
      };

      // Update avatar if a new one is provided
      if (req.file) {
         const newAvatar = req.file.filename;
         if (existingUser.avatar) {
            try {
               await deleteImageFile(
                  path.join(
                     'public/uploadImages',
                     existingUser.avatar
                  )
               );
            } catch (err) {
               console.log('Error deleting old avatar file:', err);
            }
         }
         // Set the new avatar
         updateFields.avatar = newAvatar;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
         new: true,
      });

      if (!updatedUser) {
         req.flash('error', 'Error updating user');
         return res.status(500).send('Error updating user');
      }

      req.flash('success', 'User updated successfully');
      const referer = req.headers.referer;
      res.redirect(referer);
   } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).send('Internal server error');
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
            await deleteImageFile(
               path.join(
                  '../public/uploadImages',
                  deletedUser.avatar
               )
            );
         } catch (err) {
            console.log('Error deleting avatar file:', err);
         }
      }
      req.flash('success', 'User deleted successfully');
      const referer = req.headers.referer;
      res.redirect(referer);
   } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500);
   }
};

module.exports = { updateUser, deleteUser  };
