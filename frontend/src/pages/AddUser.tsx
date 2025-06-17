import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_first_name: '',
    user_middle_name: '',
    user_last_name: '',
    user_login_email: '',
    user_password: '',
    user_mobile: '',
    user_role: 'user',
  });

  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const accesstoken = localStorage.getItem('accesstoken');

      const response = await axios.post('http://localhost:5000/adduser/adduser', {
        token,
        accesstoken,
        userData: formData,
      });

      const data = response.data;

      if (data.success) {
        setMessage(data.message);
        setError('');
        setFormData({
          user_first_name: '',
          user_middle_name: '',
          user_last_name: '',
          user_login_email: '',
          user_password: '',
          user_mobile: '',
          user_role: 'user',
        });

        // Navigate to Admin Dashboard after short delay
        setTimeout(() => {
          navigate('/admindashboard');
        }, 1000);
      } else {
        setError(data.message || 'Something went wrong');
        setMessage('');
      }
    } catch (err: any) {
      setError('Error adding user');
      setMessage('');
    }
  };

  const handleBack = () => {
    navigate('/admindashboard');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New User</h2>

      {message && <div className="bg-green-100 text-green-800 p-3 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="user_first_name"
          placeholder="First Name"
          value={formData.user_first_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="user_middle_name"
          placeholder="Middle Name (optional)"
          value={formData.user_middle_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="user_last_name"
          placeholder="Last Name"
          value={formData.user_last_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="user_login_email"
          type="email"
          placeholder="Email"
          value={formData.user_login_email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="user_password"
          type="password"
          placeholder="Password"
          value={formData.user_password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="user_mobile"
          placeholder="Mobile"
          value={formData.user_mobile}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="user_role"
          value={formData.user_role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="user">User</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="flex justify-between gap-4 pt-4">
          <Button type="button" variant="outline" className="w-1/2" onClick={handleBack}>
            Back
          </Button>
          <Button type="submit" className="w-1/2">
            Add User
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
