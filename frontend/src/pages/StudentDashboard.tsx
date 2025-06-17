"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GraduationCap, BookOpen, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import CoursesList from "./CourseList"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const IMAGE_BASE_URL = "http://localhost:5000"

type EnrolledCourse = {
  course_id: number
  course_title: string
  course_image: string | null
  course_description: string
  course_duration: string
}

type ProgressEntry = {
  id: number
  user_id: number
  course_id: number
  module_id: number
  topic_id: number
  video_id: number
  progress: number
  updated_at: string
}

type CourseProgressAggregated = {
  course_id: number
  modules_completed: number
  videos_completed: number
  average_progress: number
  time_spent: number
}

const StudentDashboard: React.FC = () => {
  const [userFullName, setUserFullName] = useState<string>("")
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState<boolean>(false)
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [progressMap, setProgressMap] = useState<Record<number, CourseProgressAggregated>>({})
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch user's full name from localStorage
    const name = localStorage.getItem("userfullname")
    if (name) setUserFullName(name)

    fetchUserProfile()
    fetchEnrolledCoursesAndProgress()
  }, [])

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token")
    const accesstoken = localStorage.getItem("accesstoken")

    if (!token || !accesstoken) {
      handleLogout()
      return
    }

    setProfileLoading(true)

    try {
      const res = await fetch("http://localhost:5000/user/view-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token.trim(),
          accesstoken: accesstoken.trim(),
        },
      })

      const data = await res.json()

      if (data.success && data.data?.user) {
        // Handle profile picture
        if (data.data.user.profile_pic?.image_name) {
          const imageUrl = `${IMAGE_BASE_URL}/Uploads/profilepics/${data.data.user.profile_pic.image_name}`
          setProfilePic(imageUrl)
        } else {
          setProfilePic(null)
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setProfileLoading(false)
    }
  }

  const fetchEnrolledCoursesAndProgress = async () => {
    const token = localStorage.getItem("token")
    const accesstoken = localStorage.getItem("accesstoken")

    if (!token || !accesstoken) {
      handleLogout()
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch enrolled courses
      const response = await fetch("http://localhost:5000/enroll/getenrollcourses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, accesstoken }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch enrolled courses: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        setEnrolledCourses(data.data)

        // Fetch progress data
        const progressResponse = await fetch("http://localhost:5000/enroll/getcourseprogress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, accesstoken }),
        })

        if (!progressResponse.ok) {
          throw new Error(`Failed to fetch progress data: ${progressResponse.statusText}`)
        }

        const progressData = await progressResponse.json()

        if (progressData.success && Array.isArray(progressData.data)) {
          const progressEntries: ProgressEntry[] = progressData.data
          const progressMap: Record<number, CourseProgressAggregated> = {}
          const modulesCompletedSet: Record<number, Set<number>> = {}
          const videosCompletedSet: Record<number, Set<number>> = {}

          // Initialize progress tracking for each course
          data.data.forEach((course: EnrolledCourse) => {
            progressMap[course.course_id] = {
              course_id: course.course_id,
              modules_completed: 0,
              videos_completed: 0,
              average_progress: 0,
              time_spent: 0,
            }
            modulesCompletedSet[course.course_id] = new Set()
            videosCompletedSet[course.course_id] = new Set()
          })

          // Process progress entries
          progressEntries.forEach((entry) => {
            if (!(entry.course_id in progressMap)) {
              return // Skip if not an enrolled course
            }

            // Track completed modules and videos
            if (entry.progress === 100) {
              if (entry.module_id) modulesCompletedSet[entry.course_id].add(entry.module_id)
              if (entry.video_id) videosCompletedSet[entry.course_id].add(entry.video_id)

              // Estimate time spent (0.5 hours per completed video)
              progressMap[entry.course_id].time_spent += 0.5
            }

            // Add to total progress for averaging later
            progressMap[entry.course_id].average_progress += entry.progress
          })

          // Calculate final aggregated values
          for (const courseIdStr in progressMap) {
            const courseId = Number(courseIdStr)
            const courseEntries = progressEntries.filter((pe) => pe.course_id === courseId)
            const totalEntries = courseEntries.length || 1

            progressMap[courseId].modules_completed = modulesCompletedSet[courseId].size
            progressMap[courseId].videos_completed = videosCompletedSet[courseId].size
            progressMap[courseId].average_progress = Math.round(progressMap[courseId].average_progress / totalEntries)
          }

          setProgressMap(progressMap)
          prepareChartData(data.data, progressMap)
        } else {
          setProgressMap({})
          setChartData(null)
        }
      } else {
        setEnrolledCourses([])
        setProgressMap({})
        setChartData(null)
      }
    } catch (error: any) {
      console.error("Error fetching data:", error)
      setError(error.message || "An error occurred while fetching data")
      setEnrolledCourses([])
      setProgressMap({})
      setChartData(null)
    } finally {
      setLoading(false)
    }
  }

  const prepareChartData = (courses: EnrolledCourse[], progress: Record<number, CourseProgressAggregated>) => {
    const labels = courses.map((course) => course.course_title)
    const modulesCompleted = courses.map((course) => progress[course.course_id]?.modules_completed || 0)
    const averageProgress = courses.map((course) => progress[course.course_id]?.average_progress || 0)
    const timeSpent = courses.map((course) => progress[course.course_id]?.time_spent || 0)

    setChartData({
      labels,
      datasets: [
        {
          label: "Modules Completed",
          data: modulesCompleted,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Average Progress (%)",
          data: averageProgress,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Time Spent (hours)",
          data: timeSpent,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    })
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const handleProfile = () => {
    navigate("/profile")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow-md px-6 py-4">
        <h1 className="text-2xl font-bold text-slate-800">Pathway Academy</h1>
        <div className="flex gap-3 items-center">
          {profileLoading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          ) : profilePic ? (
            <button
              onClick={handleProfile}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-indigo-500 transition-colors"
            >
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setProfilePic(null)}
              />
            </button>
          ) : (
            <Button variant="outline" onClick={handleProfile}>
              Profile
            </Button>
          )}
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="p-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6 max-w-xl">
            <h2 className="text-4xl font-bold text-slate-800 leading-tight">
              Welcome back, <span className="text-indigo-600">{userFullName}</span>!
            </h2>
            <p className="text-lg text-slate-600">
              Dive into a world of flexible, accessible, and top-quality learning experiences.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <FeatureIcon
                icon={<GraduationCap className="w-5 h-5" />}
                label="200+ Courses"
                color="text-indigo-600 bg-indigo-600/10"
              />
              <FeatureIcon
                icon={<BookOpen className="w-5 h-5" />}
                label="Expert Instructors"
                color="text-blue-500 bg-blue-500/10"
              />
              <FeatureIcon
                icon={<Users className="w-5 h-5" />}
                label="10K+ Students"
                color="text-green-500 bg-green-500/10"
              />
              <FeatureIcon
                icon={<Award className="w-5 h-5" />}
                label="Verified Certificates"
                color="text-yellow-500 bg-yellow-500/10"
              />
            </div>
          </div>

          {/* Right Column - Chart */}
          <div className="relative h-[400px] w-full bg-white p-4 shadow-md rounded-lg">
            {loading ? (
              <p className="text-center text-slate-600 h-full flex items-center justify-center">
                Loading progress data...
              </p>
            ) : error ? (
              <p className="text-center text-red-600 h-full flex items-center justify-center">{error}</p>
            ) : chartData ? (
              <div className="h-full">
                <h2 className="text-lg font-semibold text-slate-700 mb-2">Progress Overview</h2>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: true, text: "Course Progress" },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Value",
                        },
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <p className="text-center text-slate-600 h-full flex items-center justify-center">
                No progress data available.
              </p>
            )}
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Enrolled Courses</h2>
          {loading ? (
            <p className="text-center text-slate-600 py-8">Loading your enrolled courses...</p>
          ) : error ? (
            <p className="text-center text-red-600 py-8">{error}</p>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.course_id} className="p-6 bg-white shadow-md rounded-lg space-y-3">
                  <h3 className="text-xl font-semibold text-slate-800">{course.course_title}</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Modules Completed:</span>{" "}
                      {progressMap[course.course_id]?.modules_completed ?? 0}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Videos Completed:</span>{" "}
                      {progressMap[course.course_id]?.videos_completed ?? 0}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Average Progress:</span>{" "}
                      {progressMap[course.course_id]?.average_progress ?? 0}%
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Time Spent:</span> {progressMap[course.course_id]?.time_spent ?? 0}{" "}
                      hours
                    </p>
                  </div>
                  <Button className="w-full mt-2" onClick={() => navigate(`/course/details/${course.course_id}`)}>
                    Continue Learning
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white shadow-md rounded-lg">
              <p className="text-slate-600 mb-4">You are not enrolled in any courses yet.</p>
              <Button onClick={() => document.getElementById("all-courses")?.scrollIntoView({ behavior: "smooth" })}>
                Browse Courses
              </Button>
            </div>
          )}
        </section>

        {/* All Courses Section */}
        <section id="all-courses" className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Courses</h2>
          <CoursesList />
        </section>
      </main>
    </div>
  )
}

const FeatureIcon = ({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode
  label: string
  color: string
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export default StudentDashboard
