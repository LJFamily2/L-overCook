const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const userManagementController = require('../../controllers/admin/usersController');
const upload = require('../../middlewares/UploadMedia');
const checkAdmin = require('../../middlewares/checkAdmin');
const connectEnsureLogin = require('connect-ensure-login');

router.get('/',connectEnsureLogin.ensureLoggedIn({redirectTo:'/signin/admin'}),checkAdmin, async (req, res) => {
   const users = await User.find({ role: false });
   const admins = await User.find({ role: true });
   res.render('admin/userManagementPage', {
      layout: 'layouts/admin/defaultLayout',
      users,
      heading: 'User Management',
      admins,
      currentPage: 'user-management',
      messages: req.flash(),
      searchPage: false,
      pageName: 'users'
   });
});

// Route for handling DataTables server-side processing for users
router.post('/getUsers', (req, res) => {
   userManagementController.handleDataTableRequest(req, res, { role: false });
});

// Route for handling DataTables server-side processing for admins
router.post('/getAdmins', (req, res) => {
   userManagementController.handleDataTableRequest(req, res, { role: true });
});




// router.get('/getUsers', async (req, res) => {
//    try {
//       const users = await User.find({ role: false });
//       const admins = await User.find({ role: true });

//       res.json({
//           users: users.map((user, index) => ({
//               no: index + 1,
//               created: user.getFormattedDateTime(),
//               username: user.username,
//               email: user.email,
//               id: user._id
//           })),
//           admins: admins.map((admin, index) => ({
//               no: index + 1,
//               created: admin.getFormattedDateTime(),
//               username: admin.username,
//               email: admin.email,
//               id: admin._id
//           }))
//       });
//   } catch (error) {
//       res.status(500).send('Internal Server Error');
//   }
// });

router.post(
   '/update/:id',
   upload.single('newAvatar'),
   userManagementController.updateUser
);
router.post('/delete/:id', userManagementController.deleteUser);
router.post('/log-out', userManagementController.logout);
module.exports = router;
