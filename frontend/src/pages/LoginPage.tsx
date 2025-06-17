// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Link, useNavigate } from "react-router-dom"
// import axios from "axios"
// import { FiEye, FiEyeOff } from "react-icons/fi"
// import { toast } from "sonner"

// const LoginPage: React.FC = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const [showPassword, setShowPassword] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const navigate = useNavigate()

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//     setErrors({ ...errors, [e.target.name]: "" })
//   }

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev)
//   }

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {}
//     if (!formData.email) {
//       newErrors.email = "Email is required"
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address"
//     }
//     if (!formData.password) {
//       newErrors.password = "Password is required"
//     }
//     return newErrors
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setErrors({})
//     setSubmitting(true)

//     const validationErrors = validateForm()
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors)
//       setSubmitting(false)
//       return
//     }

//     try {
//       console.log("Sending login request with:", formData)
//       const response = await axios.post("http://localhost:5000/user/login", formData)
//       console.log("Login response:", response.data)

//       if (response.data.success) {
//         // Clear localStorage to avoid stale data
//         localStorage.clear()
//         console.log("localStorage cleared")

//         // Store tokens and user data
//         localStorage.setItem("token", response.data.token)
//         localStorage.setItem("accesstoken", response.data.accesstoken)
//         localStorage.setItem("userfullname", response.data.userfullname)
//         localStorage.setItem("userrole", response.data.userrole)
//         localStorage.setItem("session_expires_at", response.data.session_expires_at)
//         console.log("localStorage set:", {
//           token: response.data.token,
//           accesstoken: response.data.accesstoken,
//           userfullname: response.data.userfullname,
//           userrole: response.data.userrole,
//           session_expires_at: response.data.session_expires_at,
//         })

//         toast.success("Login successful!")

//         // Redirect based on role from API response
//         const userRole = response.data.userrole
//         console.log("User role from API:", userRole)

//         // Case-insensitive comparison for role
//         if (userRole && userRole.toLowerCase() === "admin") {
//           console.log("Redirecting to /admindashboard (admin role)")
//           navigate("/admindashboard", { replace: true })
//         } else {
//           console.log("Redirecting to /studentdashboard (student/user role)")
//           navigate("/studentdashboard", { replace: true })
//         }
//       } else {
//         const errorMessage = response.data.message || "Login failed. Please try again."
//         setErrors({ general: errorMessage })
//         toast.error(errorMessage)
//         console.log("Login failed:", errorMessage)
//       }
//     } catch (err: any) {
//       let errorMessage = "An unexpected error occurred."
//       if (err.response?.data?.message) {
//         switch (err.response.data.message) {
//           case "User is not activated":
//             errorMessage = "Your account is not activated. Please contact support."
//             break
//           case "No email registered with this email address":
//             errorMessage = "No account found with this email address."
//             break
//           case "Invalid email or password":
//             errorMessage = "Incorrect email or password."
//             break
//           case "More than one user found with the same email":
//             errorMessage = "Multiple accounts found. Please contact support."
//             break
//           default:
//             errorMessage = err.response.data.message
//         }
//       }
//       setErrors({ general: errorMessage })
//       toast.error(errorMessage)
//       console.error("Login error:", err.response?.data || err.message)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {errors.general && <div className="text-red-600 mb-4 text-center">{errors.general}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               type="email"
//               name="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter your email"
//               className={errors.email ? "border-red-500" : ""}
//             />
//             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//           </div>

//           <div className="mb-4">
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 id="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your password"
//                 className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
//                 onClick={togglePasswordVisibility}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//               </button>
//             </div>
//             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//           </div>

//           <div className="flex justify-end mb-4">
//             <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
//               Forgot Password?
//             </Link>
//           </div>

//           <Button type="submit" className="w-full" disabled={submitting}>
//             {submitting ? "Logging in..." : "Login"}
//           </Button>
//         </form>

//         <div className="mt-6 text-center text-sm">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginPage



"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { toast } from "sonner"

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    }
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSubmitting(false)
      return
    }

    try {
      console.log("Sending login request with:", formData)
      const response = await axios.post("http://localhost:5000/user/login", formData)
      console.log("Login response:", response.data)

      if (response.data.success) {
        // Clear localStorage to avoid stale data
        localStorage.clear()
        console.log("localStorage cleared")

        // Store tokens and user data
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("accesstoken", response.data.accesstoken)
        localStorage.setItem("userfullname", response.data.userfullname)
        localStorage.setItem("userrole", response.data.userrole)
        localStorage.setItem("session_expires_at", response.data.session_expires_at)
        console.log("localStorage set:", {
          token: response.data.token,
          accesstoken: response.data.accesstoken,
          userfullname: response.data.userfullname,
          userrole: response.data.userrole,
          session_expires_at: response.data.session_expires_at,
        })

        toast.success("Login successful!")

        // Redirect based on role from API response
        const userRole = response.data.userrole
        console.log("User role from API:", userRole)

        // Case-insensitive comparison for role
        if (userRole && userRole.toLowerCase() === "admin") {
          console.log("Redirecting to /admindashboard (admin role)")
          navigate("/admindashboard", { replace: true })
        } else {
          console.log("Redirecting to /studentdashboard (student/user role)")
          navigate("/studentdashboard", { replace: true })
        }
      } else {
        const errorMessage = response.data.message || "Login failed. Please try again."
        setErrors({ general: errorMessage })
        toast.error(errorMessage)
        console.log("Login failed:", errorMessage)
      }
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred."
      if (err.response?.data?.message) {
        switch (err.response.data.message) {
          case "User is not activated":
            errorMessage = "Your account is not activated. Please contact support."
            break
          case "No email registered with this email address":
            errorMessage = "No account found with this email address."
            break
          case "Invalid email or password":
            errorMessage = "Incorrect email or password."
            break
          case "More than one user found with the same email":
            errorMessage = "Multiple accounts found. Please contact support."
            break
          default:
            errorMessage = err.response.data.message
        }
      }
      setErrors({ general: errorMessage })
      toast.error(errorMessage)
      console.error("Login error:", err.response?.data || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
      <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Login
        </h2>

        {errors.general && (
          <div className="text-red-600 mb-4 sm:mb-6 text-center text-xs sm:text-sm md:text-base">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-6">
            <Label htmlFor="email" className="text-sm sm:text-base md:text-lg">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className={`text-sm sm:text-base md:text-lg ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4 sm:mb-6">
            <Label htmlFor="password" className="text-sm sm:text-base md:text-lg">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className={`pr-10 text-sm sm:text-base md:text-lg ${errors.password ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 sm:top-3 md:top-3.5 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" /> : <FiEye className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end mb-4 sm:mb-6">
            <Link to="/forgot-password" className="text-xs sm:text-sm md:text-base text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm md:text-base">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
