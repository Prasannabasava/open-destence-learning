"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, BookOpen, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Course {
  course_id: number
  course_title: string
  course_status?: string
  course_image?: string
  created_at?: string
}

interface EnrollmentData {
  user_id: number
  user_first_name: string
  user_middle_name: string | null
  user_last_name: string
  user_login_email: string
  user_status: boolean
  course_id: number
  course_title: string
  created_at: string
}

interface UserSearchResult {
  user_id: number
  user_login_email: string
  user_first_name: string
  user_middle_name: string | null
  user_last_name: string
  user_role: string
  [key: string]: any
}

interface ApiResponse<T = any> {
  success: boolean
  message: string
  responsecode: number
  users?: T[]
  data?: T[] | T
  pagination?: {
    currentPage: number
    totalPages: number
    totalCount: number
    pageSize: number
  }
}

class EnrollmentService {
  private baseUrl = "http://localhost:5000"

  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    const accesstoken = localStorage.getItem("accesstoken")

    if (!token || !accesstoken) {
      throw new Error("Authentication tokens are required")
    }

    return { token, accesstoken }
  }

  async getAllCourses(): Promise<ApiResponse<Course>> {
    try {
      const authHeaders = this.getAuthHeaders()

      const response = await fetch(`${this.baseUrl}/courses/getallcourses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authHeaders),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      console.error("getAllCourses Error:", error)
      return {
        success: false,
        message: error.message || "Failed to fetch courses",
        responsecode: 500,
      }
    }
  }

  async getUsersByCourseId(courseId: number): Promise<ApiResponse<EnrollmentData>> {
    try {
      const authHeaders = this.getAuthHeaders()

      const response = await fetch(`${this.baseUrl}/adduser/getusersbycourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...authHeaders,
          course_id: courseId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      console.error("getUsersByCourseId Error:", error)
      return {
        success: false,
        message: error.message || "Failed to fetch enrolled users",
        responsecode: 500,
      }
    }
  }

  async searchUsers(searchTerm: string): Promise<ApiResponse<UserSearchResult>> {
    try {
      const authHeaders = this.getAuthHeaders()

      const response = await fetch(`${this.baseUrl}/adduser/searchusers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...authHeaders,
          search: searchTerm,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      console.error("searchUsers Error:", error)
      return {
        success: false,
        message: error.message || "Failed to search users",
        responsecode: 500,
      }
    }
  }
}

export default function CourseEnrollmentManagement() {
  const enrollmentService = new EnrollmentService()

  // State management
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const { toast } = useToast()

  // Filter enrollments based on search term (local search only)
  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    const fullName = `${enrollment.user_first_name} ${enrollment.user_middle_name || ""} ${enrollment.user_last_name}`.toLowerCase()
    const email = enrollment.user_login_email.toLowerCase()
    const userId = enrollment.user_id.toString()
    
    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      userId.includes(searchLower)
    )
  })

  const fetchCourses = useCallback(async () => {
    try {
      setCoursesLoading(true)
      setError("")
      
      console.log("Fetching courses...")
      const response = await enrollmentService.getAllCourses()
      console.log("Courses response:", response)

      if (response.success) {
        let coursesData: Course[] = []
        if (response.data) {
          coursesData = Array.isArray(response.data) ? response.data : [response.data]
        } else if (response.users) {
          coursesData = Array.isArray(response.users) ? response.users : [response.users]
        }

        console.log("Setting courses:", coursesData)
        setCourses(coursesData)
        
        if (coursesData.length > 0 && !selectedCourseId) {
          setSelectedCourseId(coursesData[0].course_id.toString())
        }
      } else {
        let errorMessage = response.message || "Failed to fetch courses"
        if (response.responsecode === -1) {
          errorMessage = "Access denied: Admin role required"
        }
        setError(`Failed to fetch courses: ${errorMessage}`)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("fetchCourses error:", error)
      const errorMessage = error.message || "An unexpected error occurred while fetching courses"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setCoursesLoading(false)
    }
  }, [selectedCourseId, toast])

  const fetchEnrollments = useCallback(async (courseId: number) => {
    try {
      setLoading(true)
      setError("")
      
      console.log("Fetching enrollments for course:", courseId)
      const response = await enrollmentService.getUsersByCourseId(courseId)
      console.log("Enrollments response:", response)

      if (response.success) {
        const enrollmentData = response.users || response.data || []
        const enrollmentsArray = Array.isArray(enrollmentData) ? enrollmentData : []
        console.log("Setting enrollments:", enrollmentsArray)
        setEnrollments(enrollmentsArray)

        if (enrollmentsArray.length === 0) {
          toast({
            title: "No Data",
            description: "No users are enrolled in this course",
            variant: "default",
          })
        }
      } else {
        let errorMessage = response.message || "Failed to fetch enrolled users"
        if (response.responsecode === -1) {
          errorMessage = "Access denied: Admin role required"
        }
        setError(`Error: ${errorMessage} (Code: ${response.responsecode})`)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("fetchEnrollments error:", error)
      const errorMessage = error.message || "An unexpected error occurred while fetching enrolled users"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const handleCourseChange = (courseId: string) => {
    console.log("Course changed to:", courseId)
    setSelectedCourseId(courseId)
    setError("")
    setSearchTerm("") // Clear search when changing courses
  }

  const handleSearchChange = (value: string) => {
    console.log("Search term changed to:", value)
    setSearchTerm(value)
    setError("") // Clear error on search change
  }

  const clearSearch = () => {
    setSearchTerm("")
    setError("")
  }

  const getStatusBadgeVariant = (status: boolean) => {
    return status ? "default" : "secondary"
  }

  const getStatusText = (status: boolean) => {
    return status ? "Active" : "Inactive"
  }

  const handleRetry = () => {
    setError("")
    if (selectedCourseId) {
      fetchEnrollments(Number.parseInt(selectedCourseId))
    } else {
      fetchCourses()
    }
  }

  // Initialize component
  useEffect(() => {
    const token = localStorage.getItem("token")
    const accesstoken = localStorage.getItem("accesstoken")

    if (!token || !accesstoken) {
      setError("Authentication Error: Please log in")
      toast({
        title: "Authentication Error",
        description: "Please log in to access this page",
        variant: "destructive",
      })
      return
    }

    fetchCourses()
  }, [fetchCourses, toast])

  // Fetch enrollments when course changes
  useEffect(() => {
    if (selectedCourseId && !coursesLoading) {
      fetchEnrollments(Number.parseInt(selectedCourseId))
    }
  }, [selectedCourseId, coursesLoading, fetchEnrollments])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Course Enrollment Management</h1>
          </div>
          <p className="text-gray-600">View course enrollments and track student status</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span className="flex-1">{error}</span>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                  <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {enrollments.filter((e) => e.user_status).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="h-6 w-6 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selected Course</p>
                  <p className="text-lg font-semibold text-gray-900 truncate">
                    {courses.find((c) => c.course_id.toString() === selectedCourseId)?.course_title ||
                      "Select a course"}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <Label htmlFor="course_select">Select Course</Label>
                {coursesLoading ? (
                  <div className="h-10 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                  <Select value={selectedCourseId} onValueChange={handleCourseChange}>
                    <SelectTrigger id="course_select">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No courses available
                        </SelectItem>
                      ) : (
                        courses.map((course) => (
                          <SelectItem key={course.course_id} value={course.course_id.toString()}>
                            {course.course_title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="relative flex-1 min-w-0">
                <Label htmlFor="search">Search Users (Local)</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => selectedCourseId && fetchEnrollments(Number.parseInt(selectedCourseId))}
                  variant="outline"
                  disabled={!selectedCourseId || loading || coursesLoading}
                >
                  {loading ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Enrollments ({filteredEnrollments.length})</span>
              {searchTerm && (
                <Badge variant="outline">
                  Filtered: {filteredEnrollments.length} of {enrollments.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading courses...</p>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading enrollments...</p>
              </div>
            ) : !selectedCourseId ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-lg">Please select a course to view enrollments</p>
              </div>
            ) : filteredEnrollments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-lg">
                  {searchTerm ? "No enrollments match your search" : "No enrollments found for this course"}
                </p>
                {searchTerm && (
                  <Button variant="outline" className="mt-4" onClick={clearSearch}>
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrolled At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnrollments.map((enrollment) => (
                      <TableRow key={`${enrollment.user_id}-${enrollment.course_id}`}>
                        <TableCell className="font-medium">{enrollment.user_id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {enrollment.user_first_name} {enrollment.user_middle_name || ""}{" "}
                              {enrollment.user_last_name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{enrollment.user_login_email}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(enrollment.user_status)}>
                            {getStatusText(enrollment.user_status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(enrollment.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}