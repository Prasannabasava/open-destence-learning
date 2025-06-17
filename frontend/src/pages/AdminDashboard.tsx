
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Admincourselist from "./Admincourselist"

interface ProfileData {
  user_first_name: string
  user_middle_name: string | null
  user_last_name: string
  user_mobile: string
  user_login_email: string
  profile_pic?: {
    image_name: string
    image_mime_type: string
    image_size: number
  } | null
}

interface EnrollmentData {
  course_id: string
  course_title: string
  enrolled_count: number
}

interface ChartData {
  courseTitle: string
  enrolledUsers: number
}

const IMAGE_BASE_URL = "http://localhost:5000"

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation() // Added to track current route
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [usersToday, setUsersToday] = useState<number>(0)
  const [totalCourses, setTotalCourses] = useState<number>(0)
  const [enrollmentData, setEnrollmentData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState<boolean>(true)

  const defaultProfilePic = "/placeholder.svg?height=40&width=40"

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const fetchProfile = async () => {
    const token = localStorage.getItem("token")
    const accesstoken = localStorage.getItem("accesstoken")

    if (!token || !accesstoken) {
      setProfileLoading(false)
      return
    }

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

  const fetchEnrollmentData = async () => {
    try {
      const token = localStorage.getItem("token")
      const accesstoken = localStorage.getItem("accesstoken")

      if (!token || !accesstoken) {
        console.error("Authentication tokens missing for enrollment data")
        return
      }

      const response = await axios.post("http://localhost:5000/count/getenrolledcount", { 
        token, 
        accesstoken 
      })

      if (response.data.success) {
        const chartData = response.data.enrolledUsers.map((item: EnrollmentData) => ({
          courseTitle: item.course_title || `Course ${item.course_id}`,
          enrolledUsers: parseInt(item.enrolled_count.toString())
        }))
        setEnrollmentData(chartData)
      } else {
        console.error("Error fetching enrollment data:", response.data.message)
      }
    } catch (err) {
      console.error("Error fetching enrollment data:", err)
    }
  }

  const fetchTotalCourses = async () => {
    try {
      const token = localStorage.getItem("token")
      const accesstoken = localStorage.getItem("accesstoken")

      if (!token || !accesstoken) {
        console.error("Authentication tokens missing for total courses")
        return
      }

      const response = await axios.post("http://localhost:5000/count/getcoursescount", { 
        token, 
        accesstoken 
      })

      if (response.data.success && response.data.enrolledUsers && response.data.enrolledUsers.length > 0) {
        setTotalCourses(parseInt(response.data.enrolledUsers[0].count))
      } else {
        console.error("Error fetching total courses:", response.data.message)
      }
    } catch (err) {
      console.error("Error fetching total courses:", err)
    }
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token")
        const accesstoken = localStorage.getItem("accesstoken")

        if (!token || !accesstoken) {
          setError("Authentication tokens missing")
          setLoading(false)
          return
        }

        // Fetch total users
        const totalUsersResponse = await axios.post("http://localhost:5000/count/total-users", { token, accesstoken })
        if (totalUsersResponse.data.success) {
          setTotalUsers(totalUsersResponse.data.totalUsers)
        } else {
          setError(totalUsersResponse.data.message)
        }

        // Fetch users today
        const usersTodayResponse = await axios.post("http://localhost:5000/count/users-today", { token, accesstoken })
        if (usersTodayResponse.data.success) {
          setUsersToday(usersTodayResponse.data.usersToday)
        } else {
          setError(usersTodayResponse.data.message)
        }

        // Fetch enrollment data and total courses
        await fetchEnrollmentData()
        await fetchTotalCourses()

      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Error fetching dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    fetchProfile()
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 text-2xl font-bold text-blue-600">Admin Panel</div>
        <nav className="mt-10 flex flex-col gap-2">
          <Link
            to="/admin/dashboard"
            className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === "/admin/dashboard" ? "bg-blue-100 font-medium" : "hover:bg-blue-100"}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/manage-users"
            className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === "/admin/manage-users" ? "bg-blue-100 font-medium" : "hover:bg-blue-100"}`}
          >
            Manage Users
          </Link>
          <Link
            to="/admin/add-user"
            className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === "/admin/add-user" ? "bg-blue-100 font-medium" : "hover:bg-blue-100"}`}
          >
            Add User
          </Link>
          <Link
            to="/admin/add-course"
            className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === "/admin/add-course" ? "bg-blue-100 font-medium" : "hover:bg-blue-100"}`}
          >
            Add Course
          </Link>
          <Link
            to="/admin/admincourselist"
            className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === "/admin/admincourselist" ? "bg-blue-100 font-medium" : "hover:bg-blue-100"}`}
          >
            Course List
          </Link>
          <Link
            to="/admin/manage-courses"
            className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === "/admin/manage-courses" ? "bg-blue-100 font-medium" : "hover:bg-blue-100"}`}
          >
            Manage Courses
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between p-6 bg-white shadow-md">
          <div className="text-xl font-semibold text-gray-700">Welcome, Admin!</div>
          <div className="flex items-center gap-4">
            <Link to="/admin/profile" className="flex items-center">
              {profileLoading ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              ) : (
                <img
                  src={profilePic || defaultProfilePic}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer shadow-sm"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = defaultProfilePic
                  }}
                />
              )}
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Users</h3>
                  {loading ? (
                    <p className="text-2xl font-bold text-blue-600">Loading...</p>
                  ) : error ? (
                    <p className="text-red-500">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
                  )}
                </div>
                <div className="text-blue-500 text-3xl">
                  <i className="fas fa-users"></i>
                </div>
              </div>
            </div>

            {/* Users Registered Today */}
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Users Today</h3>
                  {loading ? (
                    <p className="text-2xl font-bold text-green-600">Loading...</p>
                  ) : error ? (
                    <p className="text-red-500">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-green-600">{usersToday}</p>
                  )}
                </div>
                <div className="text-green-500 text-3xl">
                  <i className="fas fa-user-plus"></i>
                </div>
              </div>
            </div>

            {/* Total Courses */}
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Courses</h3>
                  {loading ? (
                    <p className="text-2xl font-bold text-purple-600">Loading...</p>
                  ) : (
                    <p className="text-2xl font-bold text-purple-600">{totalCourses}</p>
                  )}
                </div>
                <div className="text-purple-500 text-3xl">
                  <i className="fas fa-book"></i>
                </div>
              </div>
            </div>

            {/* Total Enrollments */}
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Enrollments</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {enrollmentData.reduce((total, course) => total + course.enrolledUsers, 0)}
                  </p>
                </div>
                <div className="text-orange-500 text-3xl">
                  <i className="fas fa-graduation-cap"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Bar Chart */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Course Enrollment Analytics</h2>
            {enrollmentData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={enrollmentData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="courseTitle" 
                      stroke="#666"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="enrolledUsers" 
                      fill="#3b82f6" 
                      name="Enrolled Users"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <i className="fas fa-chart-bar text-4xl mb-4 text-gray-300"></i>
                  <p className="text-lg">No enrollment data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Courses List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Courses Management</h2>
              <div className="flex gap-2">
                <Link to="/admin/add-course">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <i className="fas fa-plus mr-2"></i>
                    Add New Course
                  </Button>
                </Link>
                <Link to="/quizcourse">
                  <Button variant="secondary" className="bg-green-600 hover:bg-green-700 text-white">
                    <i className="fas fa-question-circle mr-2"></i>
                    Add Quiz Questions
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <Admincourselist />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
