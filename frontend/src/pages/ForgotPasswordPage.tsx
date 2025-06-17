// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const ForgotPasswordPage = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');
//     setLoading(true);

//     try {
//       console.log('Sending forgot password request:', { email });
//       const response = await axios.post('http://localhost:5000/user/forgot-password', { email }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('Forgot password response:', response.data);

//       if (response.data.success) {
//         setMessage(response.data.message || '✅ Password reset link sent to your email.');
//       } else {
//         setError(response.data.message || '❌ Something went wrong.');
//       }
//     } catch (err: any) {
//       console.error('Forgot password error:', err.response?.data || err.message);
//       const errorMessage = err.response?.data?.message || '❌ Something went wrong. Please try again.';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>

//         {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
//         {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               name="email"
//               required
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? 'Sending...' : 'Send Reset Link'}
//           </Button>
//         </form>

//         <div className="text-center mt-4">
//           <Link to="/login" className="text-blue-600 hover:underline">
//             Back to Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/user/forgot-password',
        { email },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success) {
        setMessage(response.data.message || '✅ Password reset link sent to your email.');
      } else {
        setError(response.data.message || '❌ Something went wrong.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '❌ Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-600 hover:underline text-sm sm:text-base">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
