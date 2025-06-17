import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    course_title: '',
    course_description: '',
    course_duration: '',
    course_mode: '',
    course_tools: '',
    course_for: '',
    course_status: 'Draft',
    course_type: '', // Updated field
    modules: [] as { title: string; order: number; topics: { title: string; order: number; videos: { title: string; duration: string; order: number }[] }[] }[],
  });
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleVideoFileChange = (globalVideoIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(`Video file selected for index ${globalVideoIndex}:`, file?.name);
    if (file) {
      const validTypes = ['video/mp4'];
      if (!validTypes.includes(file.type)) {
        setError(`Video ${globalVideoIndex + 1} must be an MP4 file`);
        if (videoInputRefs.current[globalVideoIndex]) {
          videoInputRefs.current[globalVideoIndex]!.value = '';
        }
        return;
      }
      const newVideoFiles = [...videoFiles];
      newVideoFiles[globalVideoIndex] = file;
      setVideoFiles(newVideoFiles);
      setError('');
      console.log('Updated videoFiles:', newVideoFiles.map((f) => f?.name));
    } else {
      const newVideoFiles = [...videoFiles];
      newVideoFiles[globalVideoIndex] = undefined as any; // Clear the slot
      setVideoFiles(newVideoFiles);
    }
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: '', order: formData.modules.length + 1, topics: [] }],
    });
  };

  const addTopic = (moduleIndex: number) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics.push({
      title: '',
      order: newModules[moduleIndex].topics.length + 1,
      videos: [],
    });
    setFormData({ ...formData, modules: newModules });
  };

  const addVideo = (moduleIndex: number, topicIndex: number) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics[topicIndex].videos.push({
      title: '',
      duration: '',
      order: newModules[moduleIndex].topics[topicIndex].videos.length + 1,
    });
    setFormData({ ...formData, modules: newModules });
  };

  const updateModule = (index: number, field: string, value: string) => {
    const newModules = [...formData.modules];
    newModules[index][field] = value;
    setFormData({ ...formData, modules: newModules });
  };

  const updateTopic = (moduleIndex: number, topicIndex: number, field: string, value: string) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics[topicIndex][field] = value;
    setFormData({ ...formData, modules: newModules });
  };

  const updateVideo = (moduleIndex: number, topicIndex: number, videoIndex: number, field: string, value: string) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics[topicIndex].videos[videoIndex][field] = value;
    setFormData({ ...formData, modules: newModules });
  };

  const validateForm = () => {
    const { course_title, course_description, course_duration, course_mode, course_tools, course_for, course_status, course_type } = formData;

    if (!course_title || !course_description || !course_duration || !course_mode || !course_tools || !course_for || !course_status || !course_type) {
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

    let totalVideos = 0;
    for (const module of formData.modules) {
      if (!module.title || !module.order) {
        return 'All modules must have a title and order';
      }
      const moduleOrder = Number(module.order);
      if (isNaN(moduleOrder) || moduleOrder <= 0 || !Number.isInteger(moduleOrder)) {
        return 'Module order must be a positive integer';
      }
      for (const topic of module.topics || []) {
        if (!topic.title || !topic.order) {
          return 'All topics must have a title and order';
        }
        const topicOrder = Number(topic.order);
        if (isNaN(topicOrder) || topicOrder <= 0 || !Number.isInteger(topicOrder)) {
          return 'Topic order must be a positive integer';
        }
        for (const video of topic.videos || []) {
          if (!video.title || !video.duration || !video.order) {
            return 'All videos must have a title, duration, and order';
          }
          const videoDuration = Number(video.duration);
          const videoOrder = Number(video.order);
          if (isNaN(videoDuration) || videoDuration <= 0 || !Number.isInteger(videoDuration)) {
            return 'Video duration must be a positive integer';
          }
          if (isNaN(videoOrder) || videoOrder <= 0 || !Number.isInteger(videoOrder)) {
            return 'Video order must be a positive integer';
          }
          totalVideos++;
        }
      }
    }

    if (totalVideos > 0) {
      const validVideoFiles = videoFiles.filter((file) => file !== undefined && file !== null);
      if (validVideoFiles.length !== totalVideos) {
        return `Expected ${totalVideos} video files, but received ${validVideoFiles.length}`;
      }
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

    if (!token || !accesstoken) {
      setError('Please log in to add a course');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    const data = new FormData();
    data.append('token', token);
    data.append('accesstoken', accesstoken);
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'modules') {
        data.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        data.append(key, String(value));
      }
    });
    if (courseImage) {
      data.append('course_image', courseImage);
    }
    videoFiles.forEach((videoFile, index) => {
      if (videoFile) {
        data.append('videos', videoFile);
        console.log(`Appending video ${index + 1}: ${videoFile.name}`);
      }
    });

    console.log('FormData contents:');
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${typeof value === 'object' ? value.name || 'File' : value}`);
    }

    try {
      const res = await axios.post('http://localhost:5000/courses/addcourse', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setMessage(res.data.message);
        setFormData({
          course_title: '',
          course_description: '',
          course_duration: '',
          course_mode: '',
          course_tools: '',
          course_for: '',
          course_status: 'Draft',
          course_type: '',
          modules: [],
        });
        setCourseImage(null);
        setVideoFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        Object.values(videoInputRefs.current).forEach((ref) => {
          if (ref) ref.value = '';
        });
        setTimeout(() => navigate('/admindashboard'), 2000);
      } else {
        let errorMessage = res.data.message || 'Failed to add course';
        if (res.data.responsecode === -1 && errorMessage.includes('Access denied')) {
          errorMessage = 'Access denied: Only Admins can add courses';
        }
        setError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Error adding course. Please check your input and try again.';
      setError(errorMessage);
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGlobalVideoIndex = (moduleIndex: number, topicIndex: number, videoIndex: number) => {
    let globalIndex = 0;
    for (let m = 0; m < formData.modules.length; m++) {
      if (m < moduleIndex) {
        for (const topic of formData.modules[m].topics) {
          globalIndex += topic.videos.length;
        }
      } else if (m === moduleIndex) {
        for (let t = 0; t < formData.modules[m].topics.length; t++) {
          if (t < topicIndex) {
            globalIndex += formData.modules[m].topics[t].videos.length;
          } else if (t === topicIndex) {
            globalIndex += videoIndex;
            break;
          }
        }
      }
    }
    return globalIndex;
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Course</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
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
              placeholder="Enter course title"
              value={formData.course_title}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Duration (hours) <span className="text-red-500">*</span>
            </label>
            <input
              name="course_duration"
              placeholder="Enter duration (e.g., 30)"
              type="number"
              min="1"
              step="1"
              value={formData.course_duration}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="course_description"
            placeholder="Enter course description"
            value={formData.course_description}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
            disabled={loading}
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
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
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
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            >
              <option value="Published">active</option>
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
              placeholder="e.g., VS Code, Python"
              value={formData.course_tools}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course For <span className="text-red-500">*</span>
            </label>
            <input
              name="course_for"
              placeholder="e.g., Beginners"
              value={formData.course_for}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
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
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
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
              className="mt-1 w-full p-3 border rounded-md"
              ref={fileInputRef}
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Modules</h3>
          {formData.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="border p-6 mb-4 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Module Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Module Order <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={module.order}
                    onChange={(e) => updateModule(moduleIndex, 'order', e.target.value)}
                    className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3 text-gray-700">Topics</h4>
                {module.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="border p-4 mb-3 rounded-md bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Topic Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={topic.title}
                          onChange={(e) => updateTopic(moduleIndex, topicIndex, 'title', e.target.value)}
                          className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Topic Order <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={topic.order}
                          onChange={(e) => updateTopic(moduleIndex, topicIndex, 'order', e.target.value)}
                          className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-md font-medium mb-2 text-gray-700">Videos</h5>
                      {topic.videos.map((video, videoIndex) => {
                        const globalVideoIndex = getGlobalVideoIndex(moduleIndex, topicIndex, videoIndex);
                        return (
                          <div key={videoIndex} className="border p-3 mb-2 rounded-md bg-gray-50">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Video Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={video.title}
                                onChange={(e) =>
                                  updateVideo(moduleIndex, topicIndex, videoIndex, 'title', e.target.value)
                                }
                                className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={loading}
                              />
                            </div>
                            <div className="mt-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Video File (MP4) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="file"
                                accept="video/mp4"
                                onChange={(e) => handleVideoFileChange(globalVideoIndex, e)}
                                className="mt-1 w-full p-3 border rounded-md"
                                ref={(el) => (videoInputRefs.current[globalVideoIndex] = el)}
                                required
                                disabled={loading}
                              />
                            </div>
                            <div className="mt-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Video Duration (seconds) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={video.duration}
                                onChange={(e) =>
                                  updateVideo(moduleIndex, topicIndex, videoIndex, 'duration', e.target.value)
                                }
                                className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={loading}
                              />
                            </div>
                            <div className="mt-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Video Order <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={video.order}
                                onChange={(e) =>
                                  updateVideo(moduleIndex, topicIndex, videoIndex, 'order', e.target.value)
                                }
                                className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={loading}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => addVideo(moduleIndex, topicIndex)}
                        className={`mt-3 px-4 py-2 rounded text-white font-semibold ${
                          loading || !topic.title || !topic.order
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                        disabled={loading || !topic.title || !topic.order}
                      >
                        Add Video
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addTopic(moduleIndex)}
                  className={`mt-3 px-4 py-2 rounded text-white font-semibold ${
                    loading || !module.title || !module.order
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={loading || !module.title || !module.order}
                >
                  Add Topic
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addModule}
            className={`px-4 py-2 rounded text-white font-semibold ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            }`}
            disabled={loading}
          >
            Add Module
          </button>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className={`flex-1 p-3 rounded text-white font-semibold ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Add Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`flex-1 p-3 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 ${
              loading ? 'cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;