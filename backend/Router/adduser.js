const express = require('express');
const router = express.Router();
const adduser = require('../Controllers/admin/adduser');

// Admin Dashboard APIs
router.post('/adduser', adduser.addUser);
router.post('/getallusers', adduser.getallusers);
router.post('/getuserbyid', adduser.getUserById);
router.post('/updateuser', adduser.updateUser);
router.post('/deleteuser', adduser.deleteUser);

router.post('/getusersbycourse', adduser.getUsersByCourseId);
router.post('/getenrollment', adduser.getEnrollmentByUserAndCourse);
router.post('/updateenrollment', adduser.updateEnrollment);
router.post('/deleteenrollment', adduser.deleteEnrollment);

router.post('/searchuser', adduser.searchusers);

module.exports = router;
