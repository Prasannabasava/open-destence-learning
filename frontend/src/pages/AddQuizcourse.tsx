import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
}

const AddQuizcourse: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [formData, setFormData] = useState({
    courseId: "",
    moduleName: "", // Store module title, not ID
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const accesstoken = localStorage.getItem("accesstoken");

        if (!token || !accesstoken) {
          setError("Authentication tokens missing. Please log in again.");
          return;
        }

        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
          source.cancel("Request timed out");
        }, 10000);

        const response = await axios.post(
          "http://localhost:5000/courses/getallcourses",
          { token, accesstoken, page: 1, limit: 100 },
          {
            headers: { "Content-Type": "application/json" },
            cancelToken: source.token,
          }
        );

        clearTimeout(timeout);
        if (response.data.success) {
          const formattedCourses = response.data.data.map((course: any) => ({
            id: course.course_id.toString(),
            title: course.course_title,
          }));
          setCourses(formattedCourses);
          setIsAuthenticated(true);
        } else {
          setError(response.data.message || "Failed to fetch courses. Please log in again.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error fetching courses. Please check your network or log in again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  // Fetch modules when a course is selected
  useEffect(() => {
    const fetchModules = async () => {
      if (!formData.courseId) {
        setModules([]);
        setFormData((prev) => ({ ...prev, moduleName: "" }));
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const accesstoken = localStorage.getItem("accesstoken");

        if (!token || !accesstoken) {
          setError("Authentication tokens missing for modules. Please log in again.");
          setModules([]);
          setFormData((prev) => ({ ...prev, moduleName: "" }));
          return;
        }

        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
          source.cancel("Request timed out");
        }, 10000);

        const response = await axios.post(
          "http://localhost:5000/courses/getallmodules",
          { course_id: formData.courseId, token, accesstoken },
          {
            headers: { "Content-Type": "application/json" },
            cancelToken: source.token,
          }
        );

        clearTimeout(timeout);
        if (response.data.success) {
          const formattedModules = response.data.data.map((module: any) => ({
            id: module.module_id.toString(),
            title: module.module_title,
          }));
          setModules(formattedModules);
          setError("");
        } else {
          setError(response.data.message || "No modules found for this course");
          setModules([]);
          setFormData((prev) => ({ ...prev, moduleName: "" }));
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Error fetching modules for this course");
        setModules([]);
        setFormData((prev) => ({ ...prev, moduleName: "" }));
      }
    };

    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.courseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for module select: store the module title
  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      moduleName: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const accesstoken = localStorage.getItem("accesstoken");

      if (!token || !accesstoken) {
        setError("Authentication tokens missing. Please log in again.");
        setLoading(false);
        return;
      }

      if (!formData.moduleName) {
        setError("Please select a module");
        setLoading(false);
        return;
      }

      const payload = {
        token,
        accesstoken,
        module_name: formData.moduleName, // send module title
        course_id: formData.courseId,
        question: formData.question,
        options: [
          formData.option1,
          formData.option2,
          formData.option3,
          formData.option4,
        ],
        correct: Number(formData.correctAnswer) - 1, // 0-based index
      };

      const response = await axios.post(
        "http://localhost:5000/enroll/generatequiz",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setSuccess("Quiz question added successfully!");
        setFormData({
          courseId: "",
          moduleName: "",
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctAnswer: "",
        });
        setModules([]);
      } else {
        setError(response.data.message || "Failed to add quiz question");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error adding quiz question");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="flex items-center justify-between p-6 bg-white shadow-md">
        <div className="text-xl font-semibold text-gray-700">Add Quiz Questions</div>
        <Link to="/admindashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </header>
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Add New Quiz Question</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Course</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Module</label>
              <select
                name="moduleName"
                value={formData.moduleName}
                onChange={handleModuleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={!formData.courseId}
              >
                <option value="">Select a module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.title}>
                    {module.title}
                  </option>
                ))}
              </select>
              {!formData.courseId && (
                <p className="text-sm text-gray-500 mt-1">Select a course to load modules</p>
              )}
              {formData.courseId && modules.length === 0 && !error && (
                <p className="text-sm text-gray-500 mt-1">No modules available for this course</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Question</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Option 1</label>
              <input
                type="text"
                name="option1"
                value={formData.option1}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Option 2</label>
              <input
                type="text"
                name="option2"
                value={formData.option2}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Option 3</label>
              <input
                type="text"
                name="option3"
                value={formData.option3}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Option 4</label>
              <input
                type="text"
                name="option4"
                value={formData.option4}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select correct answer</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
              </select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Question"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddQuizcourse;