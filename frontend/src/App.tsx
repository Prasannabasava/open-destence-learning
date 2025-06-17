import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
// import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";
import FeaturedCourses from "./components/home/FeaturedCourses";
import HowItWorks from "./components/home/HowItWorks";
// import CourseDetail from "./pages/CourseDetail";
// import CourseIndex from "./pages/CourseIndex";
// import VideoPlayer from "./pages/VideoPlayer"; // Corrected import for the video component
// import QuizPage from "./pages/QuizPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOTPPage from "./pages/VerifyOtpPage";
import StudentDashboard from "./pages/StudentDashboard";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LogoutPage from "./pages/logoutPage";
import AdminRoutes from "./AdminRoutes";
import CourseDetails from "./pages/CourseDetails";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import CoursesList from "./pages/CourseList";
import Instructors from "./pages/Instructors";
import Faq from "./pages/faq";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsofService";
import CookiePolicy from "./pages/CookiePolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/courses" element={<Courses />} /> */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/user/resetpassword/:uid/:Eemail" element={<ResetPasswordPage />} />
          <Route path="/featured-courses" element={<FeaturedCourses />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} /> 
          <Route path="/profile" element={<ProfilePage />}/>
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/*" element={<AdminRoutes />} />
          <Route path="/course/details/:courseId" element={<CourseDetails />} />
          <Route path="/play-video" element={<VideoPlayerPage />} />
          <Route path="/courselist" element={<CoursesList />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="/faq" element={<Faq/>} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />



          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
