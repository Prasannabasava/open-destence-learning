import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Faq = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-slate-50 py-10 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 px-2 sm:px-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
              Here are some of the most common questions we receive. If you have a different question, feel free to reach out to us!
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base sm:text-lg">
                  What is Pathway Academy?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base leading-relaxed">
                  Pathway Academy is an open and distance learning platform offering flexible, accessible, and high-quality online courses to learners worldwide.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base sm:text-lg">
                  How do I enroll in a course?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base leading-relaxed">
                  You can enroll by creating an account, browsing available courses, and clicking the "Enroll" button on the course detail page.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-base sm:text-lg">
                  Are there any prerequisites?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base leading-relaxed">
                  Some advanced courses may have prerequisites, but many beginner-level courses are open to all learners without prior experience.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-base sm:text-lg">
                  Will I receive a certificate?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base leading-relaxed">
                  Yes, upon successful completion of a course, you will receive a certificate that is recognized by educational institutions and employers globally.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-base sm:text-lg">
                  How can I contact support?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base leading-relaxed">
                  You can contact our support team via the “Contact Us” page or by emailing support@pathwayacademy.org.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Faq;
