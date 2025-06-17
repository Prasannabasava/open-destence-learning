// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Link, useNavigate } from "react-router-dom";
// import axios from 'axios';
// import { Eye, EyeOff } from "lucide-react";

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     mobile: '',
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false); // Added loading state
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const imageRef = useRef<HTMLImageElement>(null);

//   const drawCurveCell = () => {
//     const canvas = canvasRef.current;
//     const image = imageRef.current;
//     if (!canvas || !image) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     canvas.width = canvas.clientWidth;
//     canvas.height = canvas.clientHeight;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const cellSize = 30;
//     const rows = Math.ceil(canvas.height / cellSize);
//     const cols = Math.ceil(canvas.width / cellSize);

//     ctx.globalCompositeOperation = 'source-over';
//     ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

//     ctx.globalCompositeOperation = 'overlay';
//     ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
//     ctx.lineWidth = 1;

//     for (let i = 0; i < rows; i++) {
//       for (let j = 0; j < cols; j++) {
//         const x = j * cellSize;
//         const y = i * cellSize;

//         ctx.beginPath();
//         ctx.moveTo(x, y + cellSize / 2);
//         ctx.quadraticCurveTo(
//           x + cellSize / 2,
//           y + cellSize / 2 + Math.sin((x + y) / 20) * 10,
//           x + cellSize,
//           y + cellSize / 2
//         );
//         ctx.stroke();
//       }
//     }
//   };

//   useEffect(() => {
//     drawCurveCell();
//     window.addEventListener('resize', drawCurveCell);
//     return () => window.removeEventListener('resize', drawCurveCell);
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setSuccessMessage('');
//     setErrors({});

//     try {
//       const { firstName, middleName, lastName, email, password, mobile } = formData;

//       const payload = {
//         user_first_name: firstName,
//         user_middle_name: middleName,
//         user_last_name: lastName,
//         user_login_email: email,
//         user_password: password,
//         user_mobile: mobile,
//       };

//       const res = await axios.post('http://localhost:5000/user/signup', payload, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       setSuccessMessage('Signup successful! Redirecting to OTP verification...');
//       setFormData({
//         firstName: '',
//         middleName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         mobile: '',
//       });

//       setTimeout(() => {
//         navigate('/verify-otp', { state: { email } });
//       }, 1000);

//     } catch (err: any) {
//       setSuccessMessage('');
//       if (err.response?.data?.message) {
//         setErrors({ general: err.response.data.message });
//       } else {
//         setErrors({ general: 'Something went wrong.' });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="relative w-full h-screen overflow-hidden">
//       <img
//         ref={imageRef}
//         src="/background.jpg"
//         alt="Background"
//         className="hidden"
//       />
//       <canvas
//         ref={canvasRef}
//         className="absolute top-0 left-0 w-full h-full z-0"
//       />

//       <div className="relative z-10 flex items-center justify-center h-full">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white bg-opacity-80 p-8 rounded-xl shadow-lg backdrop-blur-md w-full max-w-md"
//         >
//           <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>

//           <div className="mb-4">
//             <Label htmlFor="firstName">First Name</Label>
//             <Input name="firstName" value={formData.firstName} onChange={handleChange} required />
//             {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
//           </div>

//           <div className="mb-4">
//             <Label htmlFor="middleName">Middle Name</Label>
//             <Input name="middleName" value={formData.middleName} onChange={handleChange} />
//           </div>

//           <div className="mb-4">
//             <Label htmlFor="lastName">Last Name</Label>
//             <Input name="lastName" value={formData.lastName} onChange={handleChange} required />
//             {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
//           </div>

//           <div className="mb-4">
//             <Label htmlFor="email">Email</Label>
//             <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//           </div>

//           <div className="mb-4 relative">
//             <Label htmlFor="password">Password</Label>
//             <div className="flex items-center">
//               <Input
//                 id="password"
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="pr-10"
//                 required
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2"
//                 onClick={togglePasswordVisibility}
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </Button>
//             </div>
//             {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//           </div>

//           <div className="mb-4">
//             <Label htmlFor="mobile">Mobile</Label>
//             <Input name="mobile" value={formData.mobile} onChange={handleChange} required />
//             {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
//           </div>

//           {errors.general && <p className="text-red-500 text-sm mb-2">{errors.general}</p>}
//           {successMessage && <p className="text-green-600 text-sm mb-2">{successMessage}</p>}

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? 'Signing Up...' : 'Sign Up'}
//           </Button>

//           <div className="text-sm mt-4 space-y-2">
//             <p>
//               Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
//             </p>
//             <p>
//               Registered but not verified? <Link to="/verify-otp" className="text-blue-600 hover:underline">Verify OTP here</Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;





import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const drawCurveCell = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Adjust cellSize based on screen width
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    const cellSize = isMobile ? 20 : isTablet ? 20 : 30;

    const rows = Math.ceil(canvas.height / cellSize);
    const cols = Math.ceil(canvas.width / cellSize);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'overlay';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = j * cellSize;
        const y = i * cellSize;

        ctx.beginPath();
        ctx.moveTo(x, y + cellSize / 2);
        ctx.quadraticCurveTo(
          x + cellSize / 2,
          y + cellSize / 2 + Math.sin((x + y) / 20) * 10,
          x + cellSize,
          y + cellSize / 2
        );
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    drawCurveCell();
    window.addEventListener('resize', drawCurveCell);
    return () => window.removeEventListener('resize', drawCurveCell);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrors({});

    try {
      const { firstName, middleName, lastName, email, password, mobile } = formData;

      const payload = {
        user_first_name: firstName,
        user_middle_name: middleName,
        user_last_name: lastName,
        user_login_email: email,
        user_password: password,
        user_mobile: mobile,
      };

      const res = await axios.post('http://localhost:5000/user/signup', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage('Signup successful! Redirecting to OTP verification...');
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        mobile: '',
      });

      setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
      }, 1000);

    } catch (err: any) {
      setSuccessMessage('');
      if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: 'Something went wrong.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        ref={imageRef}
        src="/background.jpg"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover hidden"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-80 p-6 sm:p-5 md:p-8 rounded-xl shadow-lg backdrop-blur-md w-full max-w-sm sm:max-w-[320px] md:max-w-xl"
        >
          <h2 className="text-xl sm:text-xl md:text-3xl font-semibold mb-4 sm:mb-4 md:mb-6 text-center">
            Sign Up
          </h2>

          <div className="mb-3 sm:mb-2">
            <Label htmlFor="firstName" className="text-sm sm:text-xs md:text-base">First Name</Label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="text-sm sm:text-xs md:text-base"
            />
            {errors.firstName && <p className="text-red-500 text-xs sm:text-[10px] md:text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div className="mb-3 sm:mb-2">
            <Label htmlFor="middleName" className="text-sm sm:text-xs md:text-base">Middle Name</Label>
            <Input
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="text-sm sm:text-xs md:text-base"
            />
          </div>

          <div className="mb-3 sm:mb-2">
            <Label htmlFor="lastName" className="text-sm sm:text-xs md:text-base">Last Name</Label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="text-sm sm:text-xs md:text-base"
            />
            {errors.lastName && <p className="text-red-500 text-xs sm:text-[10px] md:text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div className="mb-3 sm:mb-2">
            <Label htmlFor="email" className="text-sm sm:text-xs md:text-base">Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="text-sm sm:text-xs md:text-base"
            />
            {errors.email && <p className="text-red-500 text-xs sm:text-[10px] md:text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-3 sm:mb-2 relative">
            <Label htmlFor="password" className="text-sm sm:text-xs md:text-base">Password</Label>
            <div className="flex items-center">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pr-10 text-sm sm:text-xs md:text-base"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4 sm:h-3.5 sm:w-3.5 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 sm:h-3.5 sm:w-3.5 md:h-5 md:w-5" />}
              </Button>
            </div>
            {errors.password && <p className="text-red-500 text-xs sm:text-[10px] md:text-sm mt-1">{errors.password}</p>}
          </div>

 futility
          <div className="mb-3 sm:mb-2">
            <Label htmlFor="mobile" className="text-sm sm:text-xs md:text-base">Mobile</Label>
            <Input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="text-sm sm:text-xs md:text-base"
            />
            {errors.mobile && <p className="text-red-500 text-xs sm:text-[10px] md:text-sm mt-1">{errors.mobile}</p>}
          </div>

          {errors.general && <p className="text-red-500 text-xs sm:text-[10px] md:text-sm mb-2 sm:mb-2 md:mb-3 text-center">{errors.general}</p>}
          {successMessage && <p className="text-green-600 text-xs sm:text-[10px] md:text-sm mb-2 sm:mb-2 md:mb-3 text-center">{successMessage}</p>}

          <Button
            type="submit"
            className="w-full h-10 sm:h-9 md:h-12 text-sm sm:text-xs md:text-base"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <div className="text-xs sm:text-[10px] md:text-sm mt-4 sm:mt-4 md:mt-6 space-y-2 text-center">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
            <p>
              Registered but not verified?{' '}
              <Link to="/verify-otp" className="text-blue-600 hover:underline">
                Verify OTP here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;