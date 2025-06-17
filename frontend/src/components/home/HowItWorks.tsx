
// import { Lightbulb, BookOpen, Award, Clock } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";

// const HowItWorks = () => {
//   const steps = [
//     {
//       icon: <Lightbulb className="h-8 w-8 text-odl-primary" />,
//       title: "Choose Your Course",
//       description: "Browse our extensive catalog of courses taught by expert instructors across various disciplines."
//     },
//     {
//       icon: <BookOpen className="h-8 w-8 text-odl-secondary" />,
//       title: "Learn At Your Pace",
//       description: "Access course materials anytime, anywhere. Study on your schedule with flexible learning options."
//     },
//     {
//       icon: <Clock className="h-8 w-8 text-odl-accent" />,
//       title: "Track Your Progress",
//       description: "Monitor your advancement through interactive dashboards and personalized progress reports."
//     },
//     {
//       icon: <Award className="h-8 w-8 text-yellow-500" />,
//       title: "Earn Certification",
//       description: "Complete your coursework to receive verified certificates recognized by industry leaders."
//     }
//   ];

//   return (
//     <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
//       <div className="odl-container">
//         <div className="text-center mb-12 animate-fade-in">
//           <h2 className="mb-4">How It Works</h2>
//           <p className="text-lg text-slate-600 max-w-3xl mx-auto">
//             Our streamlined learning platform makes it easy to acquire new skills and knowledge through a simple four-step process.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
//           {steps.map((step, index) => (
//             <div 
//               key={index} 
//               className="bg-white p-6 rounded-lg shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300 animate-fade-in"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <div className="mb-4 p-3 rounded-full bg-slate-50 inline-block">
//                 {step.icon}
//               </div>
//               <h3 className="text-xl font-bold mb-2">{step.title}</h3>
//               <p className="text-slate-600">{step.description}</p>
//             </div>
//           ))}
//         </div>

//         <div className="text-center animate-fade-in">
//           <Button asChild className="rounded-full text-base px-6 py-6 bg-odl-primary hover:bg-odl-primary/90">
//             <Link to="/courses">Start Learning Today</Link>
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HowItWorks;





import { Lightbulb, BookOpen, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Lightbulb className="h-8 w-8 text-odl-primary" />,
      title: "Choose Your Course",
      description: "Browse our extensive catalog of courses taught by expert instructors across various disciplines."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-odl-secondary" />,
      title: "Learn At Your Pace",
      description: "Access course materials anytime, anywhere. Study on your schedule with flexible learning options."
    },
    {
      icon: <Clock className="h-8 w-8 text-odl-accent" />,
      title: "Track Your Progress",
      description: "Monitor your advancement through interactive dashboards and personalized progress reports."
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Earn Certification",
      description: "Complete your coursework to receive verified certificates recognized by industry leaders."
    }
  ];

  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
      <div className="odl-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our streamlined learning platform makes it easy to acquire new skills and knowledge through a simple four-step process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 p-3 rounded-full bg-slate-50 inline-block">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <Button asChild className="rounded-full text-base px-6 py-6 bg-odl-primary hover:bg-odl-primary/90">
            <Link to="/courses">Start Learning Today</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;