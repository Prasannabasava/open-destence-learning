const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/admin/count');

// Admin Dashboard APIs
router.post('/total-users', adminController.getTotalUsers);
router.post('/users-today', adminController.getUsersRegisteredToday);
router.post('/getenrolledcount',adminController.getenrolledcount);
router.post('/getcoursescount',adminController.gettotalcourses);
module.exports = router;
