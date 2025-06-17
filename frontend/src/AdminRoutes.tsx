// AdminRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AddCourse from './pages/AddCourse';
import AddUser from './pages/AddUser';
import UpdateCourse from './pages/UpdateCourse';
import CourseForm from './pages/CourseForm';
import Admincourselist from './pages/Admincourselist';
import AddModulesForm from './pages/AddModuleForm';
import AddQuizcourse from './pages/AddQuizcourse';
import AdminProfile from './pages/AdminProfile';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';
import QuizManagement from './pages/QuizManagement';


const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-user" element={<AddUser />} />
      <Route path="/admin/add-course" element={<AddCourse />} />
      <Route path="/admin/admincourselist" element={<Admincourselist />} />
      <Route path="/course/update/:id" element={<UpdateCourse />} />
      <Route path="/courseform" element={<CourseForm />} />
      <Route path="/course/addmodules/:courseId" element={<AddModulesForm />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/manage-users" element={<UserManagement />} />
      <Route path="/admin/manage-courses" element={<CourseManagement />} />
     <Route path="/course/quizmanagement/:courseId" element={<QuizManagement />} /> 
      <Route path="/quizcourse" element={<AddQuizcourse />} />

    </Routes>
  );
};

export default AdminRoutes;
