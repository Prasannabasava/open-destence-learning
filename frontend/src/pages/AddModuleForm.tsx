

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Video {
  title: string;
  duration: string;
  order: number;
}

interface Topic {
  title: string;
  order: number;
  videos: Video[];
}

interface Module {
  title: string;
  order: number;
  topics: Topic[];
}

interface FormData {
  course_id: string;
  modules: Module[];
}

interface Course {
  course_id: string;
  course_title: string;
}

const AddModulesToCourse: React.FC = () => {
  const navigate = useNavigate();
  const { course_id: courseIdFromParams } = useParams<{ course_id: string }>();

  // Fetch all courses
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    course_id: courseIdFromParams || '',
    modules: [],
  });
  const [videoFiles, setVideoFiles] = useState<(File | null)[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const videoInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Fetch all courses for dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      setCoursesError('');
      try {
        const token = localStorage.getItem('token');
        const accesstoken = localStorage.getItem('accesstoken');
        if (!token || !accesstoken) {
          setCoursesError('Please log in to fetch courses.');
          setCourses([]);
          return;
        }
        const res = await axios.post(
          'http://localhost:5000/courses/getallcourses',
          { token, accesstoken, page: 1, limit: 100 },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (res.data.success && Array.isArray(res.data.data)) {
          setCourses(res.data.data.map((c: any) => ({
            course_id: String(c.course_id),
            course_title: c.course_title
          })));
          if (!formData.course_id && res.data.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              course_id: String(res.data.data[0].course_id),
            }));
          }
        } else {
          setCoursesError(res.data.message || "Failed to fetch courses.");
          setCourses([]);
        }
      } catch (err: any) {
        setCoursesError(err?.response?.data?.message || err.message || "Error fetching courses.");
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, course_id: e.target.value });
    setError('');
  };

  // ... all the rest of your unchanged logic ...

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleVideoFileChange = (globalVideoIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    } else {
      const newVideoFiles = [...videoFiles];
      newVideoFiles[globalVideoIndex] = null;
      setVideoFiles(newVideoFiles);
      setError('');
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
    setVideoFiles([...videoFiles, null]);
  };

  const removeModule = (moduleIndex: number) => {
    const newModules = formData.modules.filter((_, index) => index !== moduleIndex);
    newModules.forEach((module, index) => {
      module.order = index + 1;
    });
    setFormData({ ...formData, modules: newModules });
    const totalVideos = getTotalVideos();
    setVideoFiles(videoFiles.slice(0, totalVideos));
  };

  const removeTopic = (moduleIndex: number, topicIndex: number) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics = newModules[moduleIndex].topics.filter(
      (_, index) => index !== topicIndex,
    );
    newModules[moduleIndex].topics.forEach((topic, index) => {
      topic.order = index + 1;
    });
    setFormData({ ...formData, modules: newModules });
    const totalVideos = getTotalVideos();
    setVideoFiles(videoFiles.slice(0, totalVideos));
  };

  const removeVideo = (moduleIndex: number, topicIndex: number, videoIndex: number) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics[topicIndex].videos = newModules[moduleIndex].topics[
      topicIndex
    ].videos.filter((_, index) => index !== videoIndex);
    newModules[moduleIndex].topics[topicIndex].videos.forEach((video, index) => {
      video.order = index + 1;
    });
    setFormData({ ...formData, modules: newModules });
    const globalIndex = getGlobalVideoIndex(moduleIndex, topicIndex, videoIndex);
    const newVideoFiles = [...videoFiles];
    newVideoFiles.splice(globalIndex, 1);
    setVideoFiles(newVideoFiles);
  };

  const updateModule = (index: number, field: 'title' | 'order', value: string) => {
    const newModules = JSON.parse(JSON.stringify(formData.modules)) as Module[];
    if (field === 'order') {
      newModules[index].order = Number(value);
    } else {
      newModules[index][field] = value;
    }
    setFormData({ ...formData, modules: newModules });
  };

  const updateTopic = (
    moduleIndex: number,
    topicIndex: number,
    field: 'title' | 'order',
    value: string,
  ) => {
    const newModules = JSON.parse(JSON.stringify(formData.modules)) as Module[];
    if (field === 'order') {
      newModules[moduleIndex].topics[topicIndex].order = Number(value);
    } else {
      newModules[moduleIndex].topics[topicIndex][field] = value;
    }
    setFormData({ ...formData, modules: newModules });
  };

  const updateVideo = (
    moduleIndex: number,
    topicIndex: number,
    videoIndex: number,
    field: 'title' | 'duration' | 'order',
    value: string,
  ) => {
    const newModules = JSON.parse(JSON.stringify(formData.modules)) as Module[];
    if (field === 'order') {
      newModules[moduleIndex].topics[topicIndex].videos[videoIndex][field] = Number(value);
    } else {
      newModules[moduleIndex].topics[topicIndex].videos[videoIndex][field] = value;
    }
    setFormData({ ...formData, modules: newModules });
  };

  const getTotalVideos = () => {
    return formData.modules.reduce(
      (total, module) =>
        total + module.topics.reduce((topicTotal, topic) => topicTotal + topic.videos.length, 0),
      0,
    );
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

  const validateForm = () => {
    if (!formData.course_id) {
      return 'Course is required';
    }

    if (formData.modules.length === 0) {
      return 'At least one module is required';
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
      const validVideoFiles = videoFiles.filter((file) => file !== null);
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
      setError('Please log in to add modules');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    const data = new FormData();
    data.append('token', token);
    data.append('accesstoken', accesstoken);
    data.append('course_id', formData.course_id);
    data.append('modules', JSON.stringify(formData.modules));
    videoFiles.forEach((videoFile, index) => {
      if (videoFile) {
        data.append('videos', videoFile);
      }
    });

    try {
      const res = await axios.post('http://localhost:5000/courses/addmodules', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setMessage(res.data.message || 'Modules added successfully');
        setFormData({ course_id: formData.course_id, modules: [] });
        setVideoFiles([]);
        Object.values(videoInputRefs.current).forEach((ref) => {
          if (ref) ref.value = '';
        });
        setTimeout(() => navigate('/admindashboard'), 2000);
      } else {
        setError(res.data.message || 'Failed to add modules');
      }
    } catch (err: any) {
      let errorMessage = 'Error adding modules. Please try again.';
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      } else {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Add Modules to Course</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course <span className="text-red-500">*</span>
          </label>
          {coursesLoading ? (
            <div className="mt-1 text-gray-500">Loading courses...</div>
          ) : coursesError ? (
            <div className="mt-1 text-red-500">{coursesError}</div>
          ) : (
            <select
              name="course_id"
              value={formData.course_id}
              onChange={handleCourseChange}
              className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading || !!courseIdFromParams}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ...rest of the form, modules, topics, videos... */}
        {/* (Keep your existing JSX for modules/topics/videos/submit/back buttons) */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Modules</h3>
          {formData.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="border p-6 mb-4 rounded-lg bg-gray-50 relative">
              <button
                type="button"
                onClick={() => removeModule(moduleIndex)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                disabled={loading}
              >
                Remove Module
              </button>
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
                    placeholder="Enter module title"
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
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3 text-gray-700">Topics</h4>
                {module.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="border p-4 mb-3 rounded-md bg-white relative">
                    <button
                      type="button"
                      onClick={() => removeTopic(moduleIndex, topicIndex)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      disabled={loading}
                    >
                      Remove Topic
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Topic Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={topic.title}
                          onChange={(e) =>
                            updateTopic(moduleIndex, topicIndex, 'title', e.target.value)
                          }
                          className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          disabled={loading}
                          placeholder="Enter topic title"
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
                          onChange={(e) =>
                            updateTopic(moduleIndex, topicIndex, 'order', e.target.value)
                          }
                          className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          disabled={loading}
                          placeholder="e.g., 1"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-md font-medium mb-2 text-gray-700">Videos</h5>
                      {topic.videos.map((video, videoIndex) => {
                        const globalVideoIndex = getGlobalVideoIndex(
                          moduleIndex,
                          topicIndex,
                          videoIndex,
                        );
                        return (
                          <div
                            key={videoIndex}
                            className="border p-3 mb-2 rounded-md bg-gray-50 relative"
                          >
                            <button
                              type="button"
                              onClick={() => removeVideo(moduleIndex, topicIndex, videoIndex)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              disabled={loading}
                            >
                              Remove Video
                            </button>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Video Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={video.title}
                                onChange={(e) =>
                                  updateVideo(
                                    moduleIndex,
                                    topicIndex,
                                    videoIndex,
                                    'title',
                                    e.target.value,
                                  )
                                }
                                className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={loading}
                                placeholder="Enter video title"
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
                                  updateVideo(
                                    moduleIndex,
                                    topicIndex,
                                    videoIndex,
                                    'duration',
                                    e.target.value,
                                  )
                                }
                                className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={loading}
                                placeholder="e.g., 300"
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
                                  updateVideo(
                                    moduleIndex,
                                    topicIndex,
                                    videoIndex,
                                    'order',
                                    e.target.value,
                                  )
                                }
                                className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={loading}
                                placeholder="e.g., 1"
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
            {loading ? 'Submitting...' : 'Add Modules'}
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

export default AddModulesToCourse;