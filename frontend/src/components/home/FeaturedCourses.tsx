// "use client";

// import { Button } from "@/components/ui/button";
// import CoursesList from "@/pages/CourseList"; // ✅ Adjust if needed
// import { useNavigate } from "react-router-dom";

// const FeaturedCourses = () => {
//   const navigate = useNavigate();

//   const handleViewAll = () => {
//     navigate("/courselist"); // ✅ Update this path if your route is different
//   };

//   return (
//     <section className="bg-white section-padding">
//       <div className="odl-container">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
//           <div>
//             <h2 className="text-slate-800">Featured Courses</h2>
//             <p className="text-slate-500 mt-2">
//               Explore our most popular courses across various disciplines
//             </p>
//           </div>
//         </div>

//         <CoursesList />

//         <div className="mt-12 text-center">
//           <Button
//             onClick={handleViewAll}
//             className="rounded-full px-6 py-6 text-base bg-odl-primary hover:bg-odl-primary/90"
//           >
//             View All Courses
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedCourses;




"use client";

import { Button } from "@/components/ui/button";
import CoursesList from "@/pages/CourseList";
import { useNavigate } from "react-router-dom";

const FeaturedCourses: React.FC = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/courselist");
  };

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
              Featured Courses
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-slate-500 mt-2">
              Explore our most popular courses across various disciplines.
            </p>
          </div>
        </div>

        {/* Render the CoursesList component */}
        <CoursesList />

        <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
          <Button
            onClick={handleViewAll}
            className="rounded-full px-6 py-3 text-sm sm:text-base bg-odl-primary hover:bg-odl-primary/90"
            aria-label="View all available courses"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
