
// import React from "react";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { Award, BookOpen, Globe, Heart, Users, Map, Clock, BadgeCheck, Lightbulb, Target } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Link } from "react-router-dom";

// const About = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow">
//         {/* Hero Section */}
//         <section className="bg-gradient-to-b from-slate-50 to-white py-20">
//           <div className="odl-container text-center">
//             <h1 className="mb-6 text-slate-900">About Pathway Academy</h1>
//             <p className="text-xl text-slate-600 max-w-3xl mx-auto">
//               We're on a mission to provide accessible, flexible, and quality education to learners worldwide through our innovative Open and Distance Learning platform.
//             </p>
//           </div>
//         </section>

//         {/* Our Story */}
//         <section className="py-16 bg-white">
//           <div className="odl-container">
//             <div className="grid md:grid-cols-2 gap-12 items-center">
//               <div>
//                 <h2 className="mb-6 text-slate-900">Our Story</h2>
//                 <p className="text-slate-600 mb-4">
//                   Pathway Academy was founded in 2020 with a vision to break down barriers to education. We recognized that traditional educational models weren't serving everyone—especially working professionals, parents, people in remote locations, and those with accessibility needs.
//                 </p>
//                 <p className="text-slate-600 mb-4">
//                   What began as a small collection of online courses has grown into a comprehensive platform serving learners across the globe. Our team of educators, instructional designers, and technologists work together to create engaging learning experiences that are accessible to all.
//                 </p>
//                 <p className="text-slate-600">
//                   Today, we offer hundreds of courses across diverse subjects, from technology and business to arts and sciences, all designed to help learners achieve their personal and professional goals at their own pace.
//                 </p>
//               </div>
//               <div className="relative">
//                 <img 
//                   src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80" 
//                   alt="Students collaborating" 
//                   className="rounded-lg shadow-lg w-full"
//                 />
//                 <div className="absolute -bottom-6 -right-6 bg-odl-primary text-white p-6 rounded-lg shadow-lg hidden md:block">
//                   <p className="font-bold text-2xl">10,000+</p>
//                   <p>Graduates Worldwide</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Our Values */}
//         <section className="py-16 bg-slate-50">
//           <div className="odl-container">
//             <div className="text-center mb-12">
//               <h2 className="mb-6 text-slate-900">Our Core Values</h2>
//               <p className="text-slate-600 max-w-3xl mx-auto">
//                 At Pathway Academy, our values guide everything we do—from course design to student support.
//               </p>
//             </div>
            
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
//                 <CardContent className="pt-6">
//                   <div className="mb-4 bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center">
//                     <Globe className="h-6 w-6 text-odl-primary" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
//                   <p className="text-slate-600">
//                     We believe education should be accessible to everyone, regardless of location, schedule, or background.
//                   </p>
//                 </CardContent>
//               </Card>
              
//               <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
//                 <CardContent className="pt-6">
//                   <div className="mb-4 bg-purple-50 p-3 rounded-full w-12 h-12 flex items-center justify-center">
//                     <Heart className="h-6 w-6 text-purple-500" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
//                   <p className="text-slate-600">
//                     We create learning experiences that respect and celebrate diverse backgrounds, perspectives, and learning styles.
//                   </p>
//                 </CardContent>
//               </Card>
              
//               <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
//                 <CardContent className="pt-6">
//                   <div className="mb-4 bg-green-50 p-3 rounded-full w-12 h-12 flex items-center justify-center">
//                     <Award className="h-6 w-6 text-green-500" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">Excellence</h3>
//                   <p className="text-slate-600">
//                     We're committed to academic excellence and continuous improvement in our teaching methods and content.
//                   </p>
//                 </CardContent>
//               </Card>
              
//               <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
//                 <CardContent className="pt-6">
//                   <div className="mb-4 bg-yellow-50 p-3 rounded-full w-12 h-12 flex items-center justify-center">
//                     <Lightbulb className="h-6 w-6 text-yellow-500" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">Innovation</h3>
//                   <p className="text-slate-600">
//                     We embrace new technologies and teaching approaches to enhance the learning experience.
//                   </p>
//                 </CardContent>
//               </Card>
              
//               <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
//                 <CardContent className="pt-6">
//                   <div className="mb-4 bg-red-50 p-3 rounded-full w-12 h-12 flex items-center justify-center">
//                     <Users className="h-6 w-6 text-red-500" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">Community</h3>
//                   <p className="text-slate-600">
//                     We foster a supportive global community of learners and educators who inspire and help each other grow.
//                   </p>
//                 </CardContent>
//               </Card>
              
//               <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
//                 <CardContent className="pt-6">
//                   <div className="mb-4 bg-indigo-50 p-3 rounded-full w-12 h-12 flex items-center justify-center">
//                     <Target className="h-6 w-6 text-indigo-500" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">Impact</h3>
//                   <p className="text-slate-600">
//                     We measure our success by the positive change we create in our learners' lives and their communities.
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>

//         {/* Why Choose Us */}
//         <section className="py-16 bg-white">
//           <div className="odl-container">
//             <div className="text-center mb-12">
//               <h2 className="mb-6 text-slate-900">Why Choose Pathway Academy</h2>
//               <p className="text-slate-600 max-w-3xl mx-auto">
//                 Our approach to distance learning is designed to provide you with the best possible educational experience.
//               </p>
//             </div>
            
//             <div className="grid md:grid-cols-2 gap-8">
//               <div className="flex items-start gap-4">
//                 <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
//                   <Clock className="h-6 w-6 text-odl-primary" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
//                   <p className="text-slate-600">
//                     Learn at your own pace, on your own schedule. Our courses are designed to fit into your life, not the other way around.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-start gap-4">
//                 <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
//                   <BookOpen className="h-6 w-6 text-odl-primary" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">High-Quality Content</h3>
//                   <p className="text-slate-600">
//                     Our courses are developed by industry experts and academic professionals to ensure relevant, up-to-date content.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-start gap-4">
//                 <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
//                   <BadgeCheck className="h-6 w-6 text-odl-primary" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Recognized Certifications</h3>
//                   <p className="text-slate-600">
//                     Earn certificates that are recognized by employers and educational institutions worldwide.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-start gap-4">
//                 <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
//                   <Users className="h-6 w-6 text-odl-primary" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Supportive Community</h3>
//                   <p className="text-slate-600">
//                     Connect with fellow learners and instructors through discussion forums, virtual study groups, and collaborative projects.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-start gap-4">
//                 <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
//                   <Map className="h-6 w-6 text-odl-primary" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
//                   <p className="text-slate-600">
//                     Join a diverse community of learners from over 150 countries, bringing unique perspectives to your educational journey.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-start gap-4">
//                 <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
//                   <Globe className="h-6 w-6 text-odl-primary" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Accessible Platform</h3>
//                   <p className="text-slate-600">
//                     Our platform is designed to be accessible to learners with diverse needs, including those with disabilities.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Team Section */}
//         <section className="py-16 bg-slate-50">
//           <div className="odl-container">
//             <div className="text-center mb-12">
//               <h2 className="mb-6 text-slate-900">Our Leadership Team</h2>
//               <p className="text-slate-600 max-w-3xl mx-auto">
//                 Meet the dedicated professionals who guide our mission and ensure we deliver the best learning experience.
//               </p>
//             </div>
            
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[
//                 {
//                   name: "Dr. Sarah Johnson",
//                   role: "Founder & CEO",
//                   bio: "Former university dean with 20+ years in education technology.",
//                   image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
//                 },
//                 {
//                   name: "Michael Chen",
//                   role: "Chief Academic Officer",
//                   bio: "Education innovator focused on curriculum development and teaching methods.",
//                   image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
//                 },
//                 {
//                   name: "Dr. Maya Patel",
//                   role: "Director of Technology",
//                   bio: "Expert in learning platforms and educational technology integration.",
//                   image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
//                 }
//               ].map((member, index) => (
//                 <Card key={index} className="border-none shadow-md overflow-hidden">
//                   <div className="h-64 overflow-hidden">
//                     <img 
//                       src={member.image} 
//                       alt={member.name} 
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <CardContent className="p-6">
//                     <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
//                     <p className="text-odl-primary font-medium mb-2">{member.role}</p>
//                     <p className="text-slate-600">{member.bio}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="py-20 bg-odl-primary text-white">
//           <div className="odl-container text-center">
//             <h2 className="mb-6">Ready to Start Your Learning Journey?</h2>
//             <p className="text-xl mb-8 max-w-3xl mx-auto">
//               Join thousands of learners worldwide who are advancing their education and careers with Pathway Academy.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link to="/courselist" className="bg-white text-odl-primary hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors">
//                 Explore Courses
//               </Link>
//               <Link to="/contact" className="border border-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-colors">
//                 Contact Us
//               </Link>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default About;




import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Award, BookOpen, Globe, Heart, Users, Map, Clock, BadgeCheck, Lightbulb, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-20 xl:py-24">
          <div className="odl-container px-4 sm:px-6 md:px-8 xl:px-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 xl:mb-8 text-slate-900 text-center">
              About Pathway Academy
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl xl:text-3xl text-slate-600 max-w-2xl sm:max-w-3xl xl:max-w-4xl mx-auto text-center">
              We're on a mission to provide accessible, flexible, and quality education to learners worldwide through our innovative Open and Distance Learning platform.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-12 sm:py-16 md:py-19 xl:py-24 bg-white">
          <div className="odl-container px-4 sm:px-6 md:px-8 xl:px-12">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 xl:gap-16 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 xl:mb-8 text-slate-900">
                  Our Story
                </h2>
                <p className="text-sm sm:text-base md:text-base xl:text-xl text-slate-600 mb-4">
                  Pathway Academy was founded in 2024 with a vision to break down barriers to education. We recognized that traditional educational models weren't serving everyone—especially working professionals, parents, people in remote locations, and those with accessibility needs.
                </p>
                <p className="text-sm sm:text-base md:text-base xl:text-xl text-slate-600 mb-4">
                  What began as a small collection of online courses has grown into a comprehensive platform serving learners across the globe. Our team of educators, instructional designers, and technologists work together to create engaging learning experiences that are accessible to all.
                </p>
                <p className="text-sm sm:text-base md:text-base xl:text-xl text-slate-600">
                  Today, we offer hundreds of courses across diverse subjects, from technology and business to arts and sciences, all designed to help learners achieve their personal and professional goals at their own pace.
                </p>
              </div>
              <div className="order-1 md:order-2 relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
                  alt="Students collaborating"
                  className="rounded-lg shadow-lg w-full h-48 sm:h-64 md:h-80 xl:h-96 object-cover"
                />
                <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-6 xl:-bottom-8 -right-4 sm:-right-6 md:-right-6 xl:-right-8 bg-odl-primary text-white p-4 sm:p-6 xl:p-8 rounded-lg shadow-lg hidden sm:block">
                  <p className="font-bold text-lg sm:text-2xl xl:text-3xl">10,000+</p>
                  <p className="text-sm sm:text-base xl:text-lg">Graduates Worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-12 sm:py-16 md:py-20 xl:py-24 bg-slate-50">
          <div className="odl-container px-4 sm:px-6 md:px-8 xl:px-12">
            <div className="text-center mb-8 sm:mb-12 xl:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 xl:mb-8 text-slate-900">
                Our Core Values
              </h2>
              <p className="text-sm sm:text-base md:text-lg xl:text-xl text-slate-600 max-w-2xl sm:max-w-3xl xl:max-w-4xl mx-auto">
                At Pathway Academy, our values guide everything we do—from course design to student support.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-12">
              {[
                {
                  icon: <Globe className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-odl-primary" />,
                  title: "Accessibility",
                  bg: "bg-blue-50",
                  description: "We believe education should be accessible to everyone, regardless of location, schedule, or background."
                },
                {
                  icon: <Heart className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-purple-500" />,
                  title: "Inclusivity",
                  bg: "bg-purple-50",
                  description: "We create learning experiences that respect and celebrate diverse backgrounds, perspectives, and learning styles."
                },
                {
                  icon: <Award className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-green-500" />,
                  title: "Excellence",
                  bg: "bg-green-50",
                  description: "We're committed to academic excellence and continuous improvement in our teaching methods and content."
                },
                {
                  icon: <Lightbulb className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-yellow-500" />,
                  title: "Innovation",
                  bg: "bg-yellow-50",
                  description: "We embrace new technologies and teaching approaches to enhance the learning experience."
                },
                {
                  icon: <Users className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-red-500" />,
                  title: "Community",
                  bg: "bg-red-50",
                  description: "We foster a supportive global community of learners and educators who inspire and help each other grow."
                },
                {
                  icon: <Target className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-indigo-500" />,
                  title: "Impact",
                  bg: "bg-indigo-50",
                  description: "We measure our success by the positive change we create in our learners' lives and their communities."
                }
              ].map((value, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`mb-4 ${value.bg} p-2 sm:p-3 xl:p-4 rounded-full w-10 sm:w-12 xl:w-14 h-10 sm:h-12 xl:h-14 flex items-center justify-center`}>
                      {value.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl xl:text-2xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm sm:text-base xl:text-lg text-slate-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 sm:py-16 md:py-20 xl:py-24 bg-white">
          <div className="odl-container px-4 sm:px-6 md:px-8 xl:px-12">
            <div className="text-center mb-8 sm:mb-12 xl:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 xl:mb-8 text-slate-900">
                Why Choose Pathway Academy
              </h2>
              <p className="text-sm sm:text-base md:text-lg xl:text-xl text-slate-600 max-w-2xl sm:max-w-3xl xl:max-w-4xl mx-auto">
                Our approach to distance learning is designed to provide you with the best possible educational experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 xl:gap-12">
              {[
                {
                  icon: <Clock className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-odl-primary" />,
                  title: "Flexible Learning",
                  description: "Learn at your own pace, on your own schedule. Our courses are designed to fit into your life, not the other way around."
                },
                {
                  icon: <BookOpen className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-odl-primary" />,
                  title: "High-Quality Content",
                  description: "Our courses are developed by industry experts and academic professionals to ensure relevant, up-to-date content."
                },
                {
                  icon: <BadgeCheck className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-odl-primary" />,
                  title: "Recognized Certifications",
                  description: "Earn certificates that are recognized by employers and educational institutions worldwide."
                },
                {
                  icon: <Users className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-odl-primary" />,
                  title: "Supportive Community",
                  description: "Connect with fellow learners and instructors through discussion forums, virtual study groups, and collaborative projects."
                },
                {
                  icon: <Map className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-odl-primary" />,
                  title: "Global Reach",
                  description: "Join a diverse community of learners from over 150 countries, bringing unique perspectives to your educational journey."
                },
                {
                  icon: <Globe className="h-5 sm:h-6 xl:h-8 w-5 sm:w-6 xl:w-8 text-odl-primary" />,
                  title: "Accessible Platform",
                  description: "Our platform is designed to be accessible to learners with diverse needs, including those with disabilities."
                }
              ].map((reason, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4 xl:gap-6">
                  <div className="bg-blue-50 p-2 sm:p-3 xl:p-4 rounded-full h-10 sm:h-12 xl:h-14 w-10 sm:w-12 xl:w-14 flex items-center justify-center shrink-0">
                    {reason.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl xl:text-2xl font-semibold mb-2">{reason.title}</h3>
                    <p className="text-sm sm:text-base xl:text-lg text-slate-600">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 sm:py-16 md:py-20 xl:py-24 bg-slate-50">
          <div className="odl-container px-4 sm:px-6 md:px-8 xl:px-12">
            <div className="text-center mb-8 sm:mb-12 xl:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 xl:mb-8 text-slate-900">
                Our Leadership Team
              </h2>
              <p className="text-sm sm:text-base md:text-lg xl:text-xl text-slate-600 max-w-2xl sm:max-w-3xl xl:max-w-4xl mx-auto">
                Meet the dedicated professionals who guide our mission and ensure we deliver the best learning experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-12">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "Founder & CEO",
                  bio: "Former university dean with 20+ years in education technology.",
                  image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                },
                {
                  name: "Michael Chen",
                  role: "Chief Academic Officer",
                  bio: "Education innovator focused on curriculum development and teaching methods.",
                  image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                },
                {
                  name: "Dr. Maya Patel",
                  role: "Director of Technology",
                  bio: "Expert in learning platforms and educational technology integration.",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
                }
              ].map((member, index) => (
                <Card key={index} className="border-none shadow-md overflow-hidden">
                  <div className="h-48 sm:h-56 md:h-64 xl:h-72 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 sm:p-6 xl:p-8">
                    <h3 className="text-lg sm:text-xl xl:text-2xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-odl-primary font-medium text-sm sm:text-base xl:text-lg mb-2">{member.role}</p>
                    <p className="text-sm sm:text-base xl:text-lg text-slate-600">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 xl:py-24 bg-odl-primary text-white">
          <div className="odl-container px-4 sm:px-6 md:px-8 xl:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 xl:mb-8 text-center">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-base sm:text-xl md:text-2xl xl:text-2xl mb-6 sm:mb-8 xl:mb-10 max-w-2xl sm:max-w-3xl xl:max-w-4xl mx-auto text-center">
              Join thousands of learners worldwide who are advancing their education and careers with Pathway Academy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 xl:gap-6 justify-center">
              <Link
                to="/courselist"
                className="bg-white text-odl-primary hover:bg-gray-100 px-6 sm:px-8 xl:px-10 py-2 sm:py-3 xl:py-4 rounded-full font-medium text-sm sm:text-base xl:text-lg transition-colors"
              >
                Explore Courses
              </Link>
              <Link
                to="/contact"
                className="border border-white hover:bg-white/10 px-6 sm:px-8 xl:px-10 py-2 sm:py-3 xl:py-4 rounded-full font-medium text-sm sm:text-base xl:text-lg transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
