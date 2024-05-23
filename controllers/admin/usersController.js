const User = require('../../models/User');
const Recipe = require('../../models/Recipe');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
// Delete image path
const deleteImageFile = async (image) => {
   try {
      await fs.unlink(path.join('public', image));
   } catch (err) {
      console.log('Error deleting image file:', err);
   }
};

async function handleDataTableRequest(req, res, query) {
   try {
       const draw = req.body.draw;
       const start = parseInt(req.body.start, 10);
       const length = parseInt(req.body.length, 10);
       const searchValue = req.body.search.value;

       let searchQuery = query;
       if (searchValue) {
           searchQuery = {
               ...query,
               $or: [
                   { username: { $regex: searchValue, $options: 'i' } },
                   { email: { $regex: searchValue, $options: 'i' } },
               ]
           };
       }

       const totalRecords = await User.countDocuments(query);
       const filteredRecords = await User.countDocuments(searchQuery);
       const users = await User.find(searchQuery)
           .skip(start)
           .limit(length)
           .exec();

       const data = users.map((user, index) => ({
           no: start + index + 1,
           created: user.getFormattedDateTime(),
           username: user.username,
           email: user.email,
           id: user._id
       }));

       res.json({
           draw: draw,
           recordsTotal: totalRecords,
           recordsFiltered: filteredRecords,
           data: data
       });
   } catch (error) {
       console.error('Error handling DataTable request:', error);
       res.status(500).json({
           error: 'An error occurred while processing the request.'
       });
   }
}


const updateUser = async (req, res) => {
   try {
      const { id } = req.params;
      const { username, email, role, password } = req.body;
      const existingUser = await User.findById(id);
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
         const newAvatar = `/uploadImages/${req.file.filename}`;
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

module.exports = { updateUser, deleteUser, logout, handleDataTableRequest };
