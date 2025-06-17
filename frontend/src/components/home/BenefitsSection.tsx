// import { useNavigate } from "react-router-dom";
// import { LaptopIcon, Clock, Medal, Users, MessageSquare, BookOpen } from "lucide-react";

// const benefits = [
//   {
//     icon: <LaptopIcon className="h-8 w-8" />,
//     title: "Learn Anywhere",
//     description: "Access courses from any device with internet connectivity, ensuring flexibility in your learning journey."
//   },
//   {
//     icon: <Clock className="h-8 w-8" />,
//     title: "Self-Paced Learning",
//     description: "Study at your own pace and schedule, allowing you to balance education with other commitments."
//   },
//   {
//     icon: <Medal className="h-8 w-8" />,
//     title: "Recognized Certification",
//     description: "Earn verifiable certificates upon course completion to showcase your newly acquired skills."
//   },
//   {
//     icon: <Users className="h-8 w-8" />,
//     title: "Expert Instructors",
//     description: "Learn from industry professionals and academics with extensive experience in their fields."
//   },
//   {
//     icon: <MessageSquare className="h-8 w-8" />,
//     title: "Community Support",
//     description: "Engage with fellow learners through discussion forums and collaborative learning opportunities."
//   },
//   {
//     icon: <BookOpen className="h-8 w-8" />,
//     title: "Diverse Course Library",
//     description: "Choose from a wide range of subjects and disciplines to expand your knowledge horizon."
//   }
// ];

// const BenefitsSection = () => {
//   const navigate = useNavigate();

//   return (
//     <section className="bg-gradient-to-br from-slate-50 to-slate-100 section-padding">
//       <div className="odl-container">
//         <div className="text-center max-w-3xl mx-auto mb-12">
//           <h2 className="text-slate-800 mb-4">Why Choose Open Distance Learning?</h2>
//           <p className="text-slate-600 text-lg">
//             Our platform offers numerous advantages that make learning accessible, 
//             flexible, and effective for students worldwide.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {benefits.map((benefit, index) => (
//             <div 
//               key={index} 
//               className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="mb-4 inline-flex p-3 rounded-lg bg-odl-primary/10 text-odl-primary">
//                 {benefit.icon}
//               </div>
//               <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
//               <p className="text-slate-600">{benefit.description}</p>
//             </div>
//           ))}
//         </div>

//         <div className="mt-16 bg-odl-secondary/10 rounded-2xl p-8 text-center">
//           <h3 className="text-2xl font-semibold mb-4 text-odl-secondary">Ready to transform your learning experience?</h3>
//           <p className="text-slate-600 max-w-2xl mx-auto mb-6">
//             Join thousands of students who are already benefiting from our innovative approach to distance education.
//           </p>
//           <button
//             onClick={() => navigate('/login')}
//             className="inline-flex items-center justify-center rounded-full bg-odl-secondary hover:bg-odl-secondary/90 px-6 py-3 font-medium text-white transition"
//           >
//             Get Started Today
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BenefitsSection;




import { useNavigate } from "react-router-dom";
import { LaptopIcon, Clock, Medal, Users, MessageSquare, BookOpen } from "lucide-react";

const benefits = [
  {
    icon: <LaptopIcon className="h-8 w-8" />,
    title: "Learn Anywhere",
    description: "Access courses from any device with internet connectivity, ensuring flexibility in your learning journey."
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Self-Paced Learning",
    description: "Study at your own pace and schedule, allowing you to balance education with other commitments."
  },
  {
    icon: <Medal className="h-8 w-8" />,
    title: "Recognized Certification",
    description: "Earn verifiable certificates upon course completion to showcase your newly acquired skills."
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Expert Instructors",
    description: "Learn from industry professionals and academics with extensive experience in their fields."
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Community Support",
    description: "Engage with fellow learners through discussion forums and collaborative learning opportunities."
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Diverse Course Library",
    description: "Choose from a wide range of subjects and disciplines to expand your knowledge horizon."
  }
];

const BenefitsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 section-padding">
      <div className="odl-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-slate-800 mb-4">Why Choose Open Distance Learning?</h2>
          <p className="text-slate-600 text-lg">
            Our platform offers numerous advantages that make learning accessible, 
            flexible, and effective for students worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-odl-primary/10 text-odl-primary">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-odl-secondary/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4 text-odl-secondary">Ready to transform your learning experience?</h3>
          <p className="text-slate-600 max-w-2xl mx-auto mb-6">
            Join thousands of students who are already benefiting from our innovative approach to distance education.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center rounded-full bg-odl-secondary hover:bg-odl-secondary/90 px-6 py-3 font-medium text-white transition"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;