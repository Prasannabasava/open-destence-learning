const express = require("express");
const router = express.Router();
const userController = require("../Controllers/users/user"); // Ensure this path is correct
const upload = require('../middlewares/upload'); // Adjust path as needed
const { ProfilePic } = require('../Controllers/users/user');
// Authentication Routes
router.post('/signup', userController.SignUp);
router.post('/verify-otp', userController.verifyOTP);
router.post('/login', userController.Login);
router.post('/resend-otp', userController.resendOtp);
router.post('/forgot-password', userController.ForgotPassword);
router.post('/reset-password', userController.ResetPassword);
// router.post('/change-password', userController.changePassword);
// router.post('/logout', userController.Logout);

// Profile Routes
router.post('/update-profile', userController.UpdateProfile); // Update profile
// Example usage for profile pic

router.post('/profile-pic', ProfilePic);
router.post('/getprofilepic', userController.getProfilePic); // Get profile picture (use GET here)
router.post('/view-profile', userController.ViewProfile); // View profile
router.post('/contact', userController.ContactForm); // Contact form
module.exports = router;
