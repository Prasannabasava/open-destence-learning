const express = require('express');
const router = express.Router();
const enroll = require('../Controllers/users/enroll');

// Admin Dashboard APIs
router.post('/enroll', enroll.enroll);
router.post('/getenrollcourses', enroll.getEnrolledCourses);
router.post('/savecourseprogress',enroll.saveUserCourseProgress);
router.post('/getcourseprogress',enroll.getsavedprogress);
router.post('/generatequiz',enroll.generateQuiz);
router.post('/getquiz',enroll.getquiz);
router.post('/savescore',enroll.savescore);
router.post('/getscore',enroll.getscore);
router.post('/quizforcourse',enroll.generateQuizzesAfterCourseComplete);
router.post('/getquizforcourse',enroll.getquizforcompletecourse);
router.post('/finalquizscore',enroll.finalquizscore);

module.exports = router;
