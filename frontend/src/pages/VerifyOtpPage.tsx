// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';

// const VerifyOTPPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [otp, setOtp] = useState('');
//   const [userLoginEmail, setUserLoginEmail] = useState(location.state?.email || '');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);

//   const handleVerifyOTP = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
//     setLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/user/verify-otp', {
//         user_login_email: userLoginEmail,
//         otp,
//       });

//       if (response.data.success) {
//         setSuccessMessage(response.data.message || '✅ OTP verified successfully!');
//         setTimeout(() => {
//           navigate('/login');
//         }, 1000);
//       } else {
//         setError(response.data.message || '❌ Invalid OTP');
//       }
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || '❌ Something went wrong';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setError('');
//     setSuccessMessage('');
//     setResendLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/user/resend-otp', {
//         resendotptype: 'validateregister',
//         useremail: userLoginEmail,
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.data.success) {
//         setSuccessMessage(response.data.message || '✅ OTP resent successfully!');
//       } else {
//         setError(response.data.message || '❌ Failed to resend OTP');
//       }
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || '❌ Something went wrong';
//       setError(errorMessage);
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
//       <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
//       <form onSubmit={handleVerifyOTP} className="space-y-4">
//         <div>
//           <Label htmlFor="userLoginEmail">Email</Label>
//           <Input
//             id="userLoginEmail"
//             type="email"
//             placeholder="Enter your email"
//             value={userLoginEmail}
//             onChange={(e) => setUserLoginEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor="otp">OTP</Label>
//           <Input
//             id="otp"
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//           />
//         </div>

//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

//         <Button type="submit" className="w-full" disabled={loading}>
//           {loading ? 'Verifying...' : 'Verify OTP'}
//         </Button>

//         <Button
//           type="button"
//           variant="outline"
//           className="w-full mt-2"
//           onClick={handleResendOTP}
//           disabled={resendLoading || !userLoginEmail}
//         >
//           {resendLoading ? 'Resending...' : 'Resend OTP'}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default VerifyOTPPage;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [userLoginEmail, setUserLoginEmail] = useState(location.state?.email || '');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/user/verify-otp', {
        user_login_email: userLoginEmail,
        otp,
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message || '✅ OTP verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setError(response.data.message || '❌ Invalid OTP');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '❌ Something went wrong';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccessMessage('');
    setResendLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/user/resend-otp',
        {
          resendotptype: 'validateregister',
          useremail: userLoginEmail,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message || '✅ OTP resent successfully!');
      } else {
        setError(response.data.message || '❌ Failed to resend OTP');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '❌ Something went wrong';
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Verify OTP</h2>
        <form onSubmit={handleVerifyOTP} className="space-y-5">
          <div>
            <Label htmlFor="userLoginEmail">Email</Label>
            <Input
              id="userLoginEmail"
              type="email"
              placeholder="Enter your email"
              value={userLoginEmail}
              onChange={(e) => setUserLoginEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={handleResendOTP}
            disabled={resendLoading || !userLoginEmail}
          >
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
