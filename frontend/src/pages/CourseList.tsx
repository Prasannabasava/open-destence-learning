// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// type Course = {
//   course_id: number;
//   course_title: string;
//   course_description: string;
//   course_duration: number;
//   course_mode: string;
//   course_tools: string;
//   course_for: string;
//   course_status: "Draft" | "Published" | "Archived";
//   created_by: number;
//   updated_by: number;
//   course_image: string | null;
//   created_at: string;
//   updated_at: string;
//   course_type: string;
// };

// const IMAGE_BASE_URL = "http://localhost:5000";

// const CoursesList: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [enrollError, setEnrollError] = useState<{ [key: number]: string | null }>({});
//   const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(null);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const accesstoken = localStorage.getItem("accesstoken");
//   const isLoggedIn = !!token && !!accesstoken;

//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const res = await axios.post(
//           "http://localhost:5000/courses/getallcourses",
//           {
//             page: 1,
//             limit: 1000, // Fetch all courses
//             token,
//             accesstoken,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (res.data.success) {
//           setCourses(res.data.data);
//         } else {
//           setCourses([]);
//           setError(res.data.message || "Failed to fetch courses");
//         }
//       } catch (err: any) {
//         setCourses([]);
//         setError(err.response?.data?.message || "Error fetching courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [token, accesstoken]);

//   const handleEnroll = async (courseId: number) => {
//     setEnrollError((prev) => ({ ...prev, [courseId]: null }));

//     if (!isLoggedIn) {
//       navigate("/login", { state: { from: `/course/details/${courseId}` } });
//       return;
//     }

//     try {
//       setEnrollingCourseId(courseId);

//       const res = await axios.post(
//         "http://localhost:5000/enroll/enroll",
//         {
//           course_id: courseId,
//           token,
//           accesstoken,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.data.success || res.data.message?.toLowerCase().includes("already enrolled")) {
//         navigate(`/course/details/${courseId}`);
//       } else {
//         setEnrollError((prev) => ({
//           ...prev,
//           [courseId]: res.data.message || "Enrollment failed",
//         }));
//       }
//     } catch (err: any) {
//       if (err.response?.data?.message?.toLowerCase().includes("already enrolled")) {
//         navigate(`/course/details/${courseId}`);
//       } else {
//         setEnrollError((prev) => ({
//           ...prev,
//           [courseId]: err.response?.data?.message || "Enrollment failed due to server error",
//         }));
//       }
//     } finally {
//       setEnrollingCourseId(null);
//     }
//   };

//   // Group courses by course_type
//   const groupedCourses = courses.reduce((acc, course) => {
//     const type = course.course_type || "Uncategorized";
//     if (!acc[type]) {
//       acc[type] = [];
//     }
//     acc[type].push(course);
//     return acc;
//   }, {} as Record<string, Course[]>);

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">All Courses</h2>

//       {error && (
//         <div className="text-center text-red-500 mb-6 p-4 bg-red-100 rounded-lg">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading courses...</p>
//         </div>
//       ) : courses.length === 0 ? (
//         <p className="text-center text-gray-500 text-lg">No courses available.</p>
//       ) : (
//         <div className="space-y-12">
//           {Object.entries(groupedCourses).map(([courseType, courseList]) => (
//             <div key={courseType}>
//               <h3 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-600 pb-2">
//                 {courseType}
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {courseList.map((course) => (
//                   <div
//                     key={course.course_id}
//                     className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden relative"
//                   >
//                     <div className="relative">
//                       <img
//                         src={
//                           course.course_image
//                             ? `${IMAGE_BASE_URL}${course.course_image.startsWith("/") ? "" : "/"}${course.course_image}`
//                             : "/placeholder.jpg"
//                         }
//                         alt={course.course_title}
//                         className="w-full h-48 object-cover"
//                         onError={(e) => {
//                           e.currentTarget.src = "/placeholder.jpg";
//                         }}
//                       />
//                       <div className="absolute top-2 left-2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-semibold">
//                         {course.course_for}
//                       </div>
//                     </div>

//                     <div className="p-4">
//                       <h4 className="text-lg font-semibold text-gray-800 mb-2">{course.course_title}</h4>
//                       <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.course_description}</p>
//                       <div className="flex items-center text-sm text-gray-500 mb-3">
//                         <span className="flex items-center gap-1">
//                           <i className="fas fa-clock"></i> {course.course_duration} hours
//                         </span>
//                         <span className="flex items-center gap-1 ml-4">
//                           <i className="fas fa-tools"></i> {course.course_tools}
//                         </span>
//                       </div>
//                       <div className="text-xs text-gray-500 mb-3">Status: {course.course_status}</div>

//                       {enrollError[course.course_id] && (
//                         <div className="text-center text-red-600 mb-3 text-sm p-2 bg-red-100 rounded">
//                           {enrollError[course.course_id]}
//                         </div>
//                       )}

//                       <div className="mt-3">
//                         <button
//                           onClick={() => handleEnroll(course.course_id)}
//                           disabled={enrollingCourseId === course.course_id}
//                           className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 text-sm rounded-md w-full disabled:opacity-70 disabled:cursor-not-allowed"
//                         >
//                           {enrollingCourseId === course.course_id ? "Enrolling..." : "Enroll Now"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CoursesList;




"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Clock, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Course = {
  course_id: number
  course_title: string
  course_description: string
  course_duration: number
  course_mode: string
  course_tools: string
  course_for: string
  course_status: "Draft" | "Published" | "Archived"
  created_by: number
  updated_by: number
  course_image: string | null
  created_at: string
  updated_at: string
  course_type: string
}

const IMAGE_BASE_URL = "http://localhost:5000"

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [enrollError, setEnrollError] = useState<{ [key: number]: string | null }>({})
  const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(null)

  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const accesstoken = localStorage.getItem("accesstoken")
  const isLoggedIn = !!token && !!accesstoken

  const carouselRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await axios.post(
          "http://localhost:5000/courses/getallcourses",
          { page: 1, limit: 1000, token, accesstoken },
          { headers: { "Content-Type": "application/json" } }
        )

        if (res.data.success) {
          setCourses(res.data.data)
        } else {
          setCourses([])
          setError(res.data.message || "Failed to fetch courses")
        }
      } catch (err: any) {
        setCourses([])
        setError(err.response?.data?.message || "Error fetching courses")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [token, accesstoken])

  const handleEnroll = async (courseId: number) => {
    setEnrollError((prev) => ({ ...prev, [courseId]: null }))

    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/course/details/${courseId}` } })
      return
    }

    try {
      setEnrollingCourseId(courseId)

      const res = await axios.post(
        "http://localhost:5000/enroll/enroll",
        { course_id: courseId, token, accesstoken },
        { headers: { "Content-Type": "application/json" } }
      )

      if (res.data.success || res.data.message?.toLowerCase().includes("already enrolled")) {
        navigate(`/course/details/${courseId}`)
      } else {
        setEnrollError((prev) => ({
          ...prev,
          [courseId]: res.data.message || "Enrollment failed",
        }))
      }
    } catch (err: any) {
      if (err.response?.data?.message?.toLowerCase().includes("already enrolled")) {
        navigate(`/course/details/${courseId}`)
      } else {
        setEnrollError((prev) => ({
          ...prev,
          [courseId]: err.response?.data?.message || "Enrollment failed due to server error",
        }))
      }
    } finally {
      setEnrollingCourseId(null)
    }
  }

  const scrollCarousel = (courseType: string, direction: "left" | "right") => {
    const carousel = carouselRefs.current[courseType]
    if (!carousel) return

    const firstCard = carousel.querySelector(".flex-shrink-0") as HTMLElement
    if (!firstCard) return

    const cardWidth = firstCard.offsetWidth
    const gap = parseInt(getComputedStyle(carousel).gap) || 24
    const scrollAmount = cardWidth + gap

    const newScroll =
      direction === "left"
        ? carousel.scrollLeft - scrollAmount
        : carousel.scrollLeft + scrollAmount

    carousel.scrollTo({ left: newScroll, behavior: "smooth" })
  }

  const groupedCourses = courses.reduce((acc, course) => {
    const type = course.course_type || "Uncategorized"
    if (!acc[type]) acc[type] = []
    acc[type].push(course)
    return acc
  }, {} as Record<string, Course[]>)

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-8 sm:mb-12 text-center">
        All Courses
      </h2>

      {error && (
        <div className="text-center text-red-500 mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">No courses available.</p>
      ) : (
        <div className="space-y-12 sm:space-y-16">
          {Object.entries(groupedCourses).map(([courseType, courseList]) => (
            <div key={courseType} className="relative">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-3xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2">
                  {courseType}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollCarousel(courseType, "left")}
                    className="rounded-full h-10 w-10 sm:h-12 sm:w-12 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollCarousel(courseType, "right")}
                    className="rounded-full h-10 w-10 sm:h-12 sm:w-12 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </div>
              </div>

              <div
                ref={(el) => (carouselRefs.current[courseType] = el)}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar touch-auto"
              >
                {courseList.map((course) => (
                  <Card
                    key={course.course_id}
                    className="flex-shrink-0 w-[calc(100%-1rem)] sm:w-[calc(50%-1.5rem)] md:w-[360px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={
                          course.course_image
                            ? `${IMAGE_BASE_URL}${course.course_image.startsWith("/") ? "" : "/"}${course.course_image}`
                            : "/placeholder.svg?height=160&width=360"
                        }
                        alt={course.course_title}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=160&width=360"
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {course.course_for}
                      </div>
                      <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                        {course.course_status}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 line-clamp-2 min-h-[3rem]">
                        {course.course_title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[4rem]">
                        {course.course_description}
                      </p>

                      {/* ✅ Updated layout for duration & tools */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full w-fit">
                          <Clock className="h-4 w-4" />
                          {course.course_duration}h
                        </span>
                        <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full w-fit">
                          <Wrench className="h-4 w-4" />
                          {course.course_tools}
                        </span>
                      </div>

                      {enrollError[course.course_id] && (
                        <div className="text-center text-red-600 mb-3 text-sm p-2 bg-red-50 rounded-lg border border-red-200">
                          {enrollError[course.course_id]}
                        </div>
                      )}

                      <Button
                        onClick={() => handleEnroll(course.course_id)}
                        disabled={enrollingCourseId === course.course_id}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {enrollingCourseId === course.course_id ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Enrolling...
                          </div>
                        ) : (
                          "Enroll Now"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CoursesList
