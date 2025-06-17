import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-slate-50 py-10 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 leading-tight">
            Cookie Policy
          </h1>
          <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
            This Cookie Policy explains how Pathway Academy uses cookies and similar technologies when you visit our website.
          </p>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              1. What Are Cookies?
            </h2>
            <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
              Cookies are small text files stored on your device that help us enhance your experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              2. How We Use Cookies
            </h2>
            <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
              We use cookies to understand site usage, improve functionality, and personalize content.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              3. Managing Cookies
            </h2>
            <p className="text-slate-700 mb-6 text-sm sm:text-base leading-relaxed">
              You can control or disable cookies through your browser settings at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-slate-900">
              4. Contact
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              If you have questions, contact us at <strong>support@pathwayacademy.org</strong>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
