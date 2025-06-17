
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Edit, Trash2, Users, Eye, Mail, Calendar, BookOpen, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserData {
  user_id: number;
  user_first_name: string;
  user_middle_name: string | null;
  user_last_name: string;
  user_login_email: string;
  user_status: boolean;
  enrolled_courses: string[];
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  responsecode: number;
  users?: T[];
  user?: T;
}

interface UpdateUserData {
  user_first_name: string;
  user_middle_name: string;
  user_last_name: string;
  user_status: boolean; // Changed to boolean for backend compatibility
}

class UserService {
  private baseUrl = "http://localhost:5000/adduser";

  async getAllUsers(): Promise<ApiResponse<UserData>> {
    try {
      const token = localStorage.getItem("token");
      const accesstoken = localStorage.getItem("accesstoken");

      if (!token || !accesstoken) {
        console.warn("getAllUsers: Missing authentication tokens");
        return {
          success: false,
          message: "Authorization tokens are required",
          responsecode: 401,
        };
      }

      const response = await axios.post(`${this.baseUrl}/getallusers`, {
        token,
        accesstoken,
      });

      console.log("getAllUsers Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("getAllUsers Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch users",
        responsecode: error.response?.status || 500,
      };
    }
  }

  async updateUser(userId: number, userData: UpdateUserData): Promise<ApiResponse<UserData>> {
    try {
      const token = localStorage.getItem("token");
      const accesstoken = localStorage.getItem("accesstoken");

      if (!token || !accesstoken) {
        console.warn("updateUser: Missing authentication tokens");
        return {
          success: false,
          message: "Authorization tokens are required",
          responsecode: 401,
        };
      }

      const response = await axios.post(`${this.baseUrl}/updateuser`, {
        token,
        accesstoken,
        user_id: userId,
        ...userData,
      });

      console.log("updateUser Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("updateUser Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update user",
        responsecode: error.response?.status || 500,
      };
    }
  }

  async deleteUser(userId: number): Promise<ApiResponse> {
    try {
      const token = localStorage.getItem("token");
      const accesstoken = localStorage.getItem("accesstoken");

      if (!token || !accesstoken) {
        console.warn("deleteUser: Missing authentication tokens");
        return {
          success: false,
          message: "Authorization tokens are required",
          responsecode: 401,
        };
      }

      const response = await axios.post(`${this.baseUrl}/deleteuser`, {
        token,
        accesstoken,
        user_id: userId,
      });

      console.log("deleteUser Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("deleteUser Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete user",
        responsecode: error.response?.status || 500,
      };
    }
  }
}

const userService = new UserService();

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredUsers = users.filter(
    (user) =>
      user.user_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_login_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await userService.getAllUsers();
      console.log("fetchUsers Response:", response);
      if (response.success && response.users) {
        setUsers(response.users);
      } else {
        setError(response.message || "Failed to fetch users");
        toast({
          title: "Error",
          description: response.message || "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred while fetching users";
      setError(errorMessage);
      console.error("fetchUsers Error:", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await userService.deleteUser(userId);
      if (response.success) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        fetchUsers();
      } else {
        setError(response.message || "Failed to delete user");
        toast({
          title: "Error",
          description: response.message || "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred while deleting user";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      user_first_name: user.user_first_name,
      user_middle_name: user.user_middle_name || "",
      user_last_name: user.user_last_name,
      user_status: user.user_status ? "Active" : "Inactive",
    });
    setEditDialogOpen(true);
  };

  const handleViewDetails = (user: UserData) => {
    setSelectedUser(user);
    setDetailsDialogOpen(true);
  };

  const [formData, setFormData] = useState<{
    user_first_name: string;
    user_middle_name: string;
    user_last_name: string;
    user_status: "Active" | "Inactive";
  }>({
    user_first_name: "",
    user_middle_name: "",
    user_last_name: "",
    user_status: "Active",
  });

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setEditLoading(true);
    try {
      const updatePayload: UpdateUserData = {
        user_first_name: formData.user_first_name,
        user_middle_name: formData.user_middle_name,
        user_last_name: formData.user_last_name,
        user_status: formData.user_status === "Active", // Convert to boolean
      };

      const response = await userService.updateUser(selectedUser.user_id, updatePayload);
      console.log("handleSubmitEdit Response:", response);

      if (response.success) {
        toast({
          title: "Success",
          description: "User updated successfully",
        });

        // Update local state if response includes updated user
        if (response.user) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.user_id === selectedUser.user_id ? { ...user, ...response.user } : user
            )
          );
        } else {
          // Fetch all users to ensure state is updated
          await fetchUsers();
        }

        setEditDialogOpen(false);
      } else {
        setError(response.message || "Failed to update user");
        toast({
          title: "Error",
          description: response.message || "Failed to update user",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred while updating user";
      setError(errorMessage);
      console.error("handleSubmitEdit Error:", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | "Active" | "Inactive"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusBadgeVariant = (status: boolean) => {
    return status ? "default" : "secondary";
  };

  const getStatusText = (status: boolean) => {
    return status ? "Active" : "Inactive";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accesstoken = localStorage.getItem("accesstoken");
    if (!token || !accesstoken) {
      toast({
        title: "Authentication Error",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              Retry
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
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
                    {users.filter((u) => u.user_status).length}
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
                  <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {users.filter((u) => !u.user_status).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="h-6 w-6 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={fetchUsers} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-lg">Failed to load users</p>
                <Button variant="outline" className="mt-4" onClick={fetchUsers}>
                  Try Again
                </Button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-lg">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrolled Courses</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={`user-${user.user_id}`}>
                        <TableCell className="font-medium">{user.user_id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {user.user_first_name} {user.user_middle_name || ""} {user.user_last_name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{user.user_login_email}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.user_status)}>
                            {getStatusText(user.user_status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.enrolled_courses.length > 0 ? (
                              user.enrolled_courses.slice(0, 2).map((course, index) => (
                                <Badge key={`course-${index}`} variant="outline" className="text-xs">
                                  {course}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">No courses</span>
                            )}
                            {user.enrolled_courses.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.enrolled_courses.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {user.user_first_name} {user.user_last_name}? This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.user_id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <form onSubmit={handleSubmitEdit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.user_first_name}
                      onChange={(e) => handleInputChange("user_first_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.user_last_name}
                      onChange={(e) => handleInputChange("user_last_name", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    id="middle_name"
                    value={formData.user_middle_name}
                    onChange={(e) => handleInputChange("user_middle_name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={selectedUser.user_login_email} disabled className="bg-gray-100" />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.user_status}
                    onValueChange={(value: "Active" | "Inactive") => handleInputChange("user_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={editLoading}>
                    {editLoading ? "Updating..." : "Update User"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedUser.user_first_name} {selectedUser.user_middle_name || ""} {selectedUser.user_last_name}
                      </h3>
                      <p className="text-sm text-gray-600">User ID: {selectedUser.user_id}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-sm font-medium">{selectedUser.user_login_email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Status</p>
                        <Badge variant={getStatusBadgeVariant(selectedUser.user_status)} className="mt-1">
                          {getStatusText(selectedUser.user_status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-medium text-gray-700">
                      Enrolled Courses ({selectedUser.enrolled_courses.length})
                    </h4>
                  </div>

                  {selectedUser.enrolled_courses.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUser.enrolled_courses.map((course, index) => (
                        <div key={`course-detail-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{course}</span>
                          <Badge variant="outline" className="text-xs">
                            Enrolled
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No courses enrolled</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserManagement;
