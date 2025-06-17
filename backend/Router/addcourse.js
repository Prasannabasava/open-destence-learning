const express = require('express');
const router = express.Router();

const { addCourse, getAllCourses, getcoursebyid, updateCourse, deleteCourse, viewcoursesdetails, addModulesToCourse, getAllModulesOfCourse,deleteModule } = require('../Controllers/admin/addcourse');
const upload = require('../middlewares/upload'); // Adjust path as needed

// Use upload.fields middleware to handle files with specific fields
router.post('/addcourse', upload.fields([
  { name: 'course_image', maxCount: 1 },
  { name: 'videos', maxCount: 10 }
]), addCourse);

router.post('/getallcourses', getAllCourses);
router.post('/getcoursebyid', getcoursebyid);

router.put('/updatecourse', upload.single('course_image'), updateCourse);


router.post('/deletecourse', deleteCourse);

router.post('/viewcoursedetails', viewcoursesdetails );

router.post("/addmodules", upload.fields([{ name: "videos" }]), addModulesToCourse);

router.post('/getallmodules',getAllModulesOfCourse);
router.post('/deletemodule', deleteModule);

module.exports = router;
