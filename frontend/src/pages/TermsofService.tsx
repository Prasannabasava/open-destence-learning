import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-slate-50 py-10 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 leading-tight">
            Terms of Service
          </h1>

          <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of Pathway Academy's website and services.
          </p>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              1. Use of Services
            </h2>
            <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
              You agree to use our services only for lawful purposes and in accordance with these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              2. User Accounts
            </h2>
            <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              3. Intellectual Property
            </h2>
            <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
              All content and materials are owned by Pathway Academy or its licensors and protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              4. Termination
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              We may suspend or terminate your access if you violate these Terms.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
