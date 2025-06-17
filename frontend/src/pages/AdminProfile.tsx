"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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

const IMAGE_BASE_URL = "http://localhost:5000"

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [editable, setEditable] = useState(false)
  const [form, setForm] = useState<Partial<ProfileData>>({})
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const accesstoken = localStorage.getItem("accesstoken")

  const defaultProfilePic = "/placeholder.svg?height=150&width=150"

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    if (!token || !accesstoken) {
      toast.error("Authorization tokens missing. Please log in again.")
      navigate("/login")
      return
    }

    setLoading(true)
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
        setProfile(data.data.user)
        setForm({
          user_first_name: data.data.user.user_first_name,
          user_middle_name: data.data.user.user_middle_name,
          user_last_name: data.data.user.user_last_name,
          user_mobile: data.data.user.user_mobile,
          user_login_email: data.data.user.user_login_email,
        })

        // Handle profile picture
        if (data.data.user.profile_pic?.image_name) {
          // Construct URL based on Multer storage in Uploads/profilepics
          const imageUrl = `${IMAGE_BASE_URL}/Uploads/profilepics/${data.data.user.profile_pic.image_name}`
          setProfilePic(imageUrl)
        } else {
          setProfilePic(null)
        }
      } else {
        toast.error(data.message || "Failed to load profile data.")
        setProfile(null)
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setSelectedFile(null)
      return
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Only .jpg, .jpeg, or .png files are allowed.")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  const handleProfilePicUpload = async () => {
    if (!selectedFile || !token || !accesstoken) {
      toast.error("Please select a profile picture to upload.")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("profile_pic", selectedFile)
      formData.append("token", token)
      formData.append("accesstoken", accesstoken)

      const res = await fetch("http://localhost:5000/user/profile-pic", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Profile picture updated successfully")
        await fetchProfile()
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        toast.error(data.message || "Failed to upload profile picture")
      }
    } catch (error: any) {
      console.error("Error uploading profile picture:", error)
      toast.error("Error uploading profile picture")
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async () => {
    if (!form.user_first_name || !form.user_last_name || !token || !accesstoken) {
      toast.error("First name and last name are required.")
      return
    }

    setUpdating(true)
    try {
      const profileData = {
        user_first_name: form.user_first_name,
        user_middle_name: form.user_middle_name || null,
        user_last_name: form.user_last_name,
        user_login_email: form.user_login_email || profile!.user_login_email,
      }

      const res = await fetch("http://localhost:5000/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
          accesstoken: accesstoken,
        },
        body: JSON.stringify({ profileData }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Profile updated successfully")
        await fetchProfile()
        setEditable(false)
      } else {
        toast.error(data.message || "Failed to update profile")
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error("Error updating profile")
    } finally {
      setUpdating(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCancel = () => {
    if (profile) {
      setForm({
        user_first_name: profile.user_first_name,
        user_middle_name: profile.user_middle_name,
        user_last_name: profile.user_last_name,
        user_mobile: profile.user_mobile,
        user_login_email: profile.user_login_email,
      })
    }
    setEditable(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setSelectedFile(null)
  }

  // Helper function to safely get profile or form values
  const getFieldValue = (
    obj: Partial<ProfileData> | ProfileData | null,
    fieldName: keyof ProfileData
  ): string => {
    if (!obj) return "-"
    const value = obj[fieldName]
    return typeof value === "string" ? value : value === null ? "-" : String(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-10">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-10">No profile data available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <img
              src={profilePic || defaultProfilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4 shadow-lg"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = defaultProfilePic
              }}
            />

            {editable && (
              <div className="w-full max-w-sm space-y-3">
                <label className="block font-medium text-sm text-gray-700">Change Profile Picture</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  ref={fileInputRef}
                  onChange={handleProfilePicChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedFile && (
                  <Button onClick={handleProfilePicUpload} disabled={uploading} className="w-full">
                    {uploading ? "Uploading..." : "Upload Picture"}
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {[
              { label: "First Name", name: "user_first_name", required: true },
              { label: "Middle Name", name: "user_middle_name", required: false },
              { label: "Last Name", name: "user_last_name", required: true },
              { label: "Mobile", name: "user_mobile", required: false },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-medium mb-2 text-sm text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {editable ? (
                  <input
                    name={field.name}
                    value={getFieldValue(form, field.name as keyof ProfileData)}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={field.required}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-md border">
                    {getFieldValue(profile, field.name as keyof ProfileData)}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="block font-medium mb-2 text-sm text-gray-700">Email</label>
              {editable ? (
                <input
                  name="user_login_email"
                  value={getFieldValue(form, "user_login_email")}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="email"
                  placeholder="Enter your email"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-md border">
                  {getFieldValue(profile, "user_login_email")}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            {!editable ? (
              <>
                <Button onClick={() => setEditable(true)} className="px-6">
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={() => navigate("/admindashboard")} className="px-6">
                  Back to Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleUpdate} disabled={updating} className="px-6">
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="px-6">
                  Cancel
                </Button>
                <Button variant="outline" onClick={() => navigate("/admindashboard")} className="px-6">
                  Back to Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage