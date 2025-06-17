import axios from "axios"

const API_URL = "http://localhost:5000"

const getTokens = () => {
  const token = localStorage.getItem("token")
  const accesstoken = localStorage.getItem("accesstoken")
  return { token, accesstoken }
}

export const updateProgress = async (courseid: string, moduleNumber: number, videoName: string, isQuiz = false) => {
  const { token, accesstoken } = getTokens()
  if (!token || !accesstoken) {
    throw new Error("Unauthorized: Missing token or accesstoken")
  }

  try {
    const response = await axios.post(`${API_URL}/user/updateprogress`, {
      token,
      accesstoken,
      courseid,
      moduleNumber,
      videoName,
      isQuiz, // Add this flag to indicate if it's a quiz completion
    })

    console.log("Update Progress Response:", response.data) // Debug log

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || "Progress update failed")
    }
  } catch (error: any) {
    console.error("Update Progress Error:", error)
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred during progress update")
    } else if (error.request) {
      throw new Error("Network error. Please check your connection")
    } else {
      throw new Error(error.message)
    }
  }
}

export const getProgress = async (courseid: string, moduleNumber: number) => {
  const { token, accesstoken } = getTokens()
  if (!token || !accesstoken) {
    throw new Error("Unauthorized: Missing token or accesstoken")
  }

  try {
    const response = await axios.post(`${API_URL}/user/getprogress`, {
      token,
      accesstoken,
      courseid,
      moduleNumber,
    })

    console.log("Get Progress Response:", response.data) // Debug log

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message || "Failed to fetch progress")
    }
  } catch (error: any) {
    console.error("Get Progress Error:", error)
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred while fetching progress")
    } else if (error.request) {
      throw new Error("Network error. Please check your connection")
    } else {
      throw new Error(error.message)
    }
  }
}

export const updateQuizProgress = async (courseid: string, moduleNumber: number, score: number) => {
  const { token, accesstoken } = getTokens()
  if (!token || !accesstoken) {
    throw new Error("Unauthorized: Missing token or accesstoken")
  }

  try {
    const response = await axios.post(`${API_URL}/user/updateprogress`, {
      token,
      accesstoken,
      courseid,
      moduleNumber,
      videoName: "Module Quiz", // Use a consistent name for quizzes
      isQuiz: true,
      quizScore: score, // Add quiz score if needed
    })

    console.log("Update Quiz Progress Response:", response.data) // Debug log

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || "Quiz progress update failed")
    }
  } catch (error: any) {
    console.error("Update Quiz Progress Error:", error)
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred during quiz progress update")
    } else if (error.request) {
      throw new Error("Network error. Please check your connection")
    } else {
      throw new Error(error.message)
    }
  }
}

export default { updateProgress, getProgress, updateQuizProgress }
