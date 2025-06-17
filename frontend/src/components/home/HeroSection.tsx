// import { Button } from "@/components/ui/button";
// import { GraduationCap, BookOpen, Users, Award } from "lucide-react";
// import { Link } from "react-router-dom";
// import ImageCarousel from "./ImageCarousel";

// const HeroSection = () => {
//   return (
//     <section className="bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="odl-container section-padding">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
//           <div className="space-y-8 max-w-xl animate-fade-in">
//             <div className="space-y-2">
//               <h1 className="leading-tight">
//                 <span className="text-slate-800">Learn Without Limits with </span>
//                 <span className="gradient-text">Pathway Academy</span>
//               </h1>
//               <p className="text-xl text-slate-600">
//                 Unlock your potential with flexible, accessible, and high-quality distance learning experiences designed for your success.
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-4">
//               <Link to="/featured-courses">
//                 <Button className="rounded-full text-base px-6 py-6 bg-odl-primary hover:bg-odl-primary/90">
//                   Explore Courses
//                 </Button>
//               </Link>

//               <Link to="/how-it-works">
//                 <Button variant="outline" className="rounded-full text-base px-6 py-6">
//                   How It Works
//                 </Button>
//               </Link>
//             </div>

//             <div className="flex flex-wrap gap-6">
//               <div className="flex items-center gap-2">
//                 <div className="p-2 rounded-full bg-odl-primary/10 text-odl-primary">
//                   <GraduationCap className="w-5 h-5" />
//                 </div>
//                 <span className="text-sm font-medium">
//                   200+ Courses
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="p-2 rounded-full bg-odl-secondary/10 text-odl-secondary">
//                   <BookOpen className="w-5 h-5" />
//                 </div>
//                 <span className="text-sm font-medium">
//                   Expert Instructors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="p-2 rounded-full bg-odl-accent/10 text-odl-accent">
//                   <Users className="w-5 h-5" />
//                 </div>
//                 <span className="text-sm font-medium">
//                   10K+ Students
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500">
//                   <Award className="w-5 h-5" />
//                 </div>
//                 <span className="text-sm font-medium">
//                   Verified Certificates
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="relative md:h-[500px] animate-fade-in">
//             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-odl-primary/30 to-odl-secondary/30 rounded-2xl transform rotate-3"></div>
//             <div className="relative overflow-hidden rounded-2xl h-full border shadow-xl bg-white">
//               <img
//                 src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
//                 alt="Student learning online"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2">
//                     <div className="flex">
//                     </div>
                   
//                   </div>
//                 </div>
//               </div>
//               {/* Added Quote */}
//               <div className="absolute bottom-0 w-full bg-black/50 text-white p-4 text-sm z-20">
//                 “Education is the most powerful weapon which you can use to change the world.”
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const Star = ({ filled }: { filled: boolean }) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill={filled ? "currentColor" : "none"}
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="text-yellow-400"
//     >
//       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//     </svg>
//   );
// };

// export default HeroSection;


"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="space-y-6 max-w-xl animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-slate-800">Learn Without Limits with </span>
                <span className="gradient-text">Pathway Academy</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600">
                Unlock your potential with flexible, accessible, and high-quality distance learning experiences designed for your success.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/featured-courses">
                <Button className="rounded-full text-sm sm:text-base px-6 py-3 bg-odl-primary hover:bg-odl-primary/90" aria-label="Explore available courses">
                  Explore Courses
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" className="rounded-full text-sm sm:text-base px-6 py-3" aria-label="Learn how Pathway Academy works">
                  How It Works
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-odl-primary/10 text-odl-primary">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  200+ Courses
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-odl-secondary/10 text-odl-secondary">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  Expert Instructors
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-odl-accent/10 text-odl-accent">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  10K+ Students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  Verified Certificates
                </span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-odl-primary/30 to-odl-secondary/30 rounded-2xl transform rotate-3"></div>
            <div className="relative overflow-hidden rounded-2xl h-full border shadow-xl bg-white">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                alt="Student learning online at Pathway Academy"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                <div className="text-xs sm:text-sm lg:text-base">
                  “Education is the most powerful weapon which you can use to change the world.”
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;