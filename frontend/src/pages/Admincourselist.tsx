
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

type Course = {
  course_id: number;
  course_title: string;
  course_description: string;
  course_duration: number;
  course_mode: string;
  course_tools: string;
  course_for: string;
  course_status: "Draft" | "Published" | "Archived";
  created_by: number;
  updated_by: number;
  course_image: string | null;
  created_at: string;
  updated_at: string;
  course_type: string;
};

const IMAGE_BASE_URL = "http://localhost:5000";

const Admincourselist: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [moduleIds, setModuleIds] = useState<Record<number, string>>({}); // Store module_id per course
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const accesstoken = localStorage.getItem("accesstoken");
  const isLoggedIn = !!token && !!accesstoken;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.post("http://localhost:5000/courses/getallcourses", {
          page: 1,
          limit: 1000,
          token,
          accesstoken,
        });

        if (res.data.success) {
          setCourses(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch courses");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, accesstoken]);

  const handleUpdate = (courseId: number) => {
    if (isLoggedIn) {
      navigate(`/course/update/${courseId}`);
    } else {
      navigate("/login", { state: { from: `/course/update/${courseId}` } });
    }
  };

  const handleViewDetails = (courseId: number) => {
    if (isLoggedIn) {
      navigate(`/course/details/${courseId}`);
    } else {
      navigate("/login", { state: { from: `/course/details/${courseId}` } });
    }
  };

  const handleAddModules = (courseId: number) => {
    if (isLoggedIn) {
      navigate(`/course/addmodules/${courseId}`);
    } else {
      navigate("/login", { state: { from: `/course/addmodules/${courseId}` } });
    }
  };

  const handleAddQuiz = (courseId: number) => {
    if (isLoggedIn) {
      navigate(`/course/quizmanagement/${courseId}`);
    } else {
      navigate("/login", { state: { from: `/course/quizmanagement/${courseId}` } });
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/admin/courses` } });
      return;
    }

    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await axios.post("http://localhost:5000/courses/deleteCourse", {
        token,
        accesstoken,
        course_id: courseId,
      });

      if (res.data.success) {
        alert(res.data.message || "Course deleted successfully");
        // Refresh course list
        const fetchRes = await axios.post("http://localhost:5000/courses/getallcourses", {
          page: 1,
          limit: 1000,
          token,
          accesstoken,
        });
        if (fetchRes.data.success) {
          setCourses(fetchRes.data.data);
        }
      } else {
        alert(res.data.message || "Failed to delete course");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting course");
    }
  };

  const handleDeleteModule = async (courseId: number) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/admin/courses` } });
      return;
    }

    const moduleId = moduleIds[courseId];
    if (!moduleId) {
      alert("Please enter a module ID");
      return;
    }

    if (!confirm(`Are you sure you want to delete module ID ${moduleId}?`)) return;

    try {
      const res = await axios.post("http://localhost:5000/modules/deleteModule", {
        token,
        accesstoken,
        module_id: parseInt(moduleId),
      });

      if (res.data.success) {
        alert(res.data.message || "Module deleted successfully");
        // Clear module ID input
        setModuleIds((prev) => ({ ...prev, [courseId]: "" }));
      } else {
        alert(res.data.message || "Failed to delete module");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting module");
    }
  };

  // Group courses by course_type
  const groupedCourses = courses.reduce((acc, course) => {
    const type = course.course_type || "Uncategorized";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">All Courses</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-center text-red-500 text-lg">No courses available.</p>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedCourses).map(([courseType, courseList]) => (
            <div key={courseType}>
              <h3 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-600 pb-2">
                {courseType}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseList.map((course) => (
                  <div
                    key={course.course_id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden relative"
                  >
                    <div className="relative">
                      <img
                        src={
                          course.course_image
                            ? `${IMAGE_BASE_URL}${course.course_image.startsWith("/") ? "" : "/"}${course.course_image}`
                            : "/placeholder.jpg"
                        }
                        alt={course.course_title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-semibold">
                        {course.course_for}
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{course.course_title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.course_description}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-clock"></i> {course.course_duration} hours
                        </span>
                        <span className="flex items-center gap-1 ml-4">
                          <i className="fas fa-tools"></i> {course.course_tools}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">Status: {course.course_status}</div>

                      {/* Module ID Input for Deletion */}
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Enter Module ID to delete"
                          value={moduleIds[course.course_id] || ""}
                          onChange={(e) =>
                            setModuleIds((prev) => ({ ...prev, [course.course_id]: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-sm border rounded-md"
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleUpdate(course.course_id)}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-md flex-1 min-w-[80px] sm:min-w-[100px]"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleViewDetails(course.course_id)}
                          className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 text-sm rounded-md flex-1 min-w-[80px] sm:min-w-[100px]"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleAddModules(course.course_id)}
                          className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 text-sm rounded-md flex-1 min-w-[80px] sm:min-w-[100px]"
                        >
                          Add Modules
                        </button>
                        <button
                          onClick={() => handleAddQuiz(course.course_id)}
                          className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm rounded-md flex-1 min-w-[80px] sm:min-w-[100px]"
                        >
                          Add Quiz
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.course_id)}
                          className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 text-sm rounded-md flex-1 min-w-[80px] sm:min-w-[100px]"
                        >
                          Delete Course
                        </button>
                        <button
                          onClick={() => handleDeleteModule(course.course_id)}
                          className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 text-sm rounded-md flex-1 min-w-[80px] sm:min-w-[100px]"
                        >
                          Delete Module
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admincourselist;
