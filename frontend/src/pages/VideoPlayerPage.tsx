import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VideoPlayerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    videoUrl,
    videoTitle,
    course_id,
    module_id,
    topic_id,
    video_id,
  } = location.state || {};

  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const accesstoken = localStorage.getItem("accesstoken");

  const handleDownloadNotes = () => {
    const blob = new Blob([notes], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${videoTitle || "notes"}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleComplete = async () => {
    // Check for required fields
    if (!token || !accesstoken) {
      setSaveError("Please log in to save your progress.");
      return;
    }

    if (!course_id) {
      setSaveError("Course identifier is missing.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/enroll/savecourseprogress",
        {
          token,
          accesstoken,
          course_id,
          module_id: module_id || null, // Backend allows null
          topic_id: topic_id || null,   // Backend allows null
          video_id: video_id || null,   // Backend allows null
          progress: 100,                // Mark video as complete
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success response
      if (response.data.success) {
        setSaveSuccess(response.data.message || "Progress saved successfully!");
      } else {
        setSaveError(response.data.message || "Failed to save progress.");
      }
    } catch (error: any) {
      console.error("Error saving progress:", error);

      // Handle error response
      if (error.response?.data?.message) {
        setSaveError(error.response.data.message);
      } else {
        setSaveError("An error occurred while saving progress.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!videoUrl) {
    return <p className="text-center mt-4 text-red-500">No video URL provided</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{videoTitle}</h2>

      <video
        src={`http://localhost:5000/uploads/videos/${videoUrl}`}
        controls
        autoPlay
        className="w-full rounded mb-6"
      >
        Your browser does not support the video tag.
      </video>

      <div className="mb-6">
        <label htmlFor="notes" className="block font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your notes here..."
          className="w-full border border-gray-300 rounded p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {saveSuccess && (
        <p className="text-green-600 mb-4 font-semibold">{saveSuccess}</p>
      )}
      {saveError && (
        <p className="text-red-600 mb-4 font-semibold">{saveError}</p>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={handleDownloadNotes}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Download Notes
        </button>

        <button
          onClick={handleComplete}
          disabled={saving}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            saving ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "Saving..." : "Complete"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default VideoPlayerPage;