import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LogoutPage: React.FC = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No session found. Please log in again.");
      navigate("/login");
      return;
    }

    setLoggingOut(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            token,
          },
        }
      );

      if (res.data.success) {
        toast.success("Logged out successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("accesstoken");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Failed to log out");
      }
    } catch (error: any) {
      console.error("Error logging out:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error logging out");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Logout</h1>
      <p className="mb-6">Are you sure you want to log out?</p>
      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleLogout}
          disabled={loggingOut}
          className="px-6"
        >
          {loggingOut ? "Logging out..." : "Confirm Logout"}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/studentdashboard")}
          className="px-6"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default LogoutPage;