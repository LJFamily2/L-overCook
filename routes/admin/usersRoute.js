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
      messages: req.flash()
   });
});
router.post(
   '/update/:id',
   upload.single('newAvatar'),
   userManagementController.updateUser
);
router.post('/delete/:id', userManagementController.deleteUser);
router.post('/log-out', userManagementController.logout);
module.exports = router;
