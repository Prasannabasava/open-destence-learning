// src/services/courseService.js or courseService.ts
import axios from "axios";

const API_URL = "http://localhost:5000";

const getTokens = () => {
  const token = localStorage.getItem("token");
  const accesstoken = localStorage.getItem("accesstoken");
  return { token, accesstoken };
};

export const enrollInCourse = async (courseId) => {
  const { token, accesstoken } = getTokens();

  // Validate tokens
  if (!token || !accesstoken) {
    throw new Error("Unauthorized: Missing token or accesstoken");
  }

  try {
    const response = await axios.post(
      `${API_URL}/user/enroll`,
      {
        token,
        accesstoken,
        courseid: courseId,
      }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Enrollment failed");
    }
  } catch (error) {
    if (error.response) {
      // Handle HTTP errors from the backend
      throw new Error(error.response.data.message || "An error occurred during enrollment");
    } else if (error.request) {
      // Handle network errors
      throw new Error("Network error. Please check your connection.");
    } else {
      // Handle other errors
      throw new Error(error.message);
    }
  }
};

export default { enrollInCourse };