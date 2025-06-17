import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-slate-50 py-10 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 leading-tight">
            Privacy Policy
          </h1>

          <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
            At Pathway Academy, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.
          </p>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              1. Information We Collect
            </h2>
            <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
              We may collect personal information such as name, email, and usage data when you register or interact with our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              2. How We Use Your Information
            </h2>
            <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
              Your data is used to provide educational content, support services, and improve your learning experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              3. Data Protection
            </h2>
            <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
              We implement security measures to protect your data from unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              4. Contact Us
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              If you have questions about this policy, contact us at <strong>support@pathwayacademy.org</strong>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
