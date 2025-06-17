import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface FormData {
  course_title: string;
  course_description: string;
  course_duration: number | string; // Allow string for input, number for submission
  course_mode: string;
  course_tools: string;
  course_for: string;
  course_status: 'Draft' | 'Published' | 'Archived';
  course_type: string; // Added course_type
}

const UpdateCourse: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormData>({
    course_title: '',
    course_description: '',
    course_duration: '',
    course_mode: '',
    course_tools: '',
    course_for: '',
    course_status: 'Draft',
    course_type: '',
  });

  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem('token');
      const accesstoken = localStorage.getItem('accesstoken');

      if (!id || !token || !accesstoken) {
        setError('Missing required credentials or course ID');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/courses/getcoursebyid', {
          token,
          accesstoken,
          course_id: id,
        });

        if (response.data.success) {
          const course = response.data.data;
          setFormData({
            course_title: course.course_title || '',
            course_description: course.course_description || '',
            course_duration: course.course_duration ? String(course.course_duration) : '',
            course_mode: course.course_mode || '',
            course_tools: course.course_tools || '',
            course_for: course.course_for || '',
            course_status: course.course_status || 'Draft',
            course_type: course.course_type || '', // Populate course_type
          });
        } else {
          setError(response.data.message || 'Failed to load course data');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Course image must be a JPEG or PNG file');
        setCourseImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setCourseImage(file);
      setError('');
    } else {
      setCourseImage(null);
    }
  };

  const validateForm = () => {
    const { course_title, course_description, course_duration, course_mode, course_for, course_status, course_type } = formData;

    if (!course_title || !course_description || !course_duration || !course_mode || !course_for || !course_status || !course_type) {
      return 'All course fields, including course type, are required';
    }

    const durationNum = Number(course_duration);
    if (isNaN(durationNum) || durationNum <= 0 || !Number.isInteger(durationNum)) {
      return 'Course duration must be a positive integer';
    }

    const allowedTypes = ['Technology', 'Business', 'Finance', 'Marketing'];
    if (!allowedTypes.includes(course_type)) {
      return `Course type must be one of: ${allowedTypes.join(', ')}`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const token = localStorage.getItem('token');
    const accesstoken = localStorage.getItem('accesstoken');

    if (!token || !accesstoken || !id) {
      setError('Missing authentication or course ID');
      return;
    }

    const data = new FormData();
    data.append('token', token);
    data.append('accesstoken', accesstoken);
    data.append('course_id', id);

    // Append formData, ensuring course_duration is a number
    Object.entries({ ...formData, course_duration: Number(formData.course_duration) }).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    if (courseImage) {
      data.append('course_image', courseImage); // Single file, matches req.file
    }

    try {
      setLoading(true);
      const response = await axios.put('http://localhost:5000/courses/updatecourse', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setMessage(response.data.message || 'Course updated successfully');
        setTimeout(() => navigate('/admindashboard'), 1500);
      } else {
        let errorMessage = response.data.message || 'Update failed';
        if (response.data.responsecode === -1 && errorMessage.includes('Access denied')) {
          errorMessage = 'Access denied: Only Admins can update courses';
        }
        setError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Server error while updating course';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Update Course</h2>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {loading && !formData.course_title && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course data...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              name="course_title"
              value={formData.course_title}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Duration (hours) <span className="text-red-500">*</span>
            </label>
            <input
              name="course_duration"
              type="number"
              min="1"
              step="1"
              value={formData.course_duration}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="course_description"
            value={formData.course_description}
            onChange={handleChange}
            required
            disabled={loading}
            className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Mode <span className="text-red-500">*</span>
            </label>
            <select
              name="course_mode"
              value={formData.course_mode}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Status <span className="text-red-500">*</span>
            </label>
            <select
              name="course_status"
              value={formData.course_status}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Published">actve</option>
              <option value="Archived">inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Tools <span className="text-red-500">*</span>
            </label>
            <input
              name="course_tools"
              value={formData.course_tools}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course For <span className="text-red-500">*</span>
            </label>
            <input
              name="course_for"
              value={formData.course_for}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Type <span className="text-red-500">*</span>
            </label>
            <select
              name="course_type"
              value={formData.course_type}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Personal Development">Personal Development</option>
              <option value="Photography">Photography</option>
              <option value="Music">Music</option>
              <option value="Education & Teaching">Education & Teaching</option>
              <option value="Language Learning">Language Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Software Development">Software Development</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="Project Management">Project Management</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Law">Law</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Social Sciences">Social Sciences</option>
              <option value="Art & Illustration">Art & Illustration</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="Blockchain">Blockchain</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Environmental Studies">Environmental Studies</option>
              <option value="Game Development">Game Development</option>
              <option value="Networking & Security">Networking & Security</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Public Speaking">Public Speaking</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Image</label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              disabled={loading}
              className="mt-1 w-full p-3 border rounded-md"
              ref={fileInputRef}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 p-3 rounded text-white font-semibold ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className={`flex-1 p-3 rounded bg-gray-200 text-gray-800 font-semibold ${
              loading ? 'cursor-not-allowed' : 'hover:bg-gray-300'
            }`}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;