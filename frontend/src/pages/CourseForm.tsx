// CourseForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CourseForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState([
    { title: '', description: '', videos: [{ title: '', url: '' }] },
  ]);

  const handleModuleChange = (index, field, value) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const handleVideoChange = (modIndex, vidIndex, field, value) => {
    const newModules = [...modules];
    newModules[modIndex].videos[vidIndex][field] = value;
    setModules(newModules);
  };

  const addModule = () => {
    setModules([...modules, { title: '', description: '', videos: [{ title: '', url: '' }] }]);
  };

  const addVideo = (modIndex) => {
    const newModules = [...modules];
    newModules[modIndex].videos.push({ title: '', url: '' });
    setModules(newModules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/add-course', {
        title,
        description,
        modules,
      });
      alert('Course added successfully!');
      setTitle('');
      setDescription('');
      setModules([{ title: '', description: '', videos: [{ title: '', url: '' }] }]);
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold">Add Course</h2>
      <input
        className="w-full p-2 border rounded"
        type="text"
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Course Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <h3 className="text-lg font-semibold">Modules</h3>
      {modules.map((mod, modIndex) => (
        <div key={modIndex} className="border p-4 rounded mb-4">
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Module Title"
            value={mod.title}
            onChange={(e) => handleModuleChange(modIndex, 'title', e.target.value)}
            required
          />
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Module Description"
            value={mod.description}
            onChange={(e) => handleModuleChange(modIndex, 'description', e.target.value)}
            required
          />
          <h4 className="font-medium">Videos</h4>
          {mod.videos.map((vid, vidIndex) => (
            <div key={vidIndex} className="flex gap-2 mb-2">
              <input
                className="flex-1 p-2 border rounded"
                type="text"
                placeholder="Video Title"
                value={vid.title}
                onChange={(e) => handleVideoChange(modIndex, vidIndex, 'title', e.target.value)}
                required
              />
              <input
                className="flex-1 p-2 border rounded"
                type="text"
                placeholder="Video URL"
                value={vid.url}
                onChange={(e) => handleVideoChange(modIndex, vidIndex, 'url', e.target.value)}
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addVideo(modIndex)}
            className="text-blue-600 text-sm hover:underline"
          >
            + Add Video
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addModule}
        className="text-blue-600 text-sm hover:underline"
      >
        + Add Module
      </button>
      <button type="submit" className="block w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default CourseForm;