import React from "react";
import Navbar from "@/components/layout/Navbar"; // ✅ Adjust if path differs
import Footer from "@/components/layout/Footer"; // ✅ Adjust if path differs
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Instructors = () => {
  // Sample instructor data (replace with API fetch if available)
  const instructors = [
    {
      name: "Dr. Emily Carter",
      role: "Lead Instructor, Technology",
      bio: "Expert in software engineering with 15 years of teaching experience at top universities.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1061&q=80",
    },
    {
      name: "Prof. James Rodriguez",
      role: "Instructor, Business",
      bio: "Seasoned entrepreneur and business strategist with a focus on leadership development.",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1061&q=80",
    },
    {
      name: "Dr. Aisha Khan",
      role: "Instructor, Health & Medicine",
      bio: "Renowned public health expert with a passion for online education and student success.",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1061&q=80",
    },
    {
      name: "Prof. Liam O’Connor",
      role: "Instructor, Arts & Humanities",
      bio: "Award-winning historian and author, dedicated to making history accessible to all.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1061&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="odl-container text-center">
            <h1 className="mb-6 text-slate-900 text-4xl font-bold">Our Instructors</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Meet the passionate educators at Pathway Academy who bring expertise, dedication, and innovation to your learning journey.
            </p>
          </div>
        </section>

        {/* Instructors Section */}
        <section className="py-16 bg-slate-50">
          <div className="odl-container">
            <div className="text-center mb-12">
              <h2 className="mb-6 text-slate-900 text-3xl font-semibold">Expert Educators</h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-lg">
                Our instructors are industry leaders and academic professionals committed to delivering high-quality, engaging, and accessible education.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((instructor, index) => (
                <Card key={index} className="border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg"; // Fallback image
                      }}
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{instructor.name}</h3>
                    <p className="text-odl-primary font-medium mb-2">{instructor.role}</p>
                    <p className="text-slate-600">{instructor.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-odl-primary text-white">
          <div className="odl-container text-center">
            <h2 className="mb-6 text-3xl font-bold">Start Learning with Our Experts</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Explore our courses and learn from the best instructors in the industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courselist"
                className="bg-white text-odl-primary hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors"
              >
                Browse Courses
              </Link>
              <Link
                to="/contact"
                className="border border-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Instructors;