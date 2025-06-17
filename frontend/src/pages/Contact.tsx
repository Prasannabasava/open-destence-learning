import React from "react";
import axios from "axios"; // Add axios import
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const Contact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("http://localhost:5000/user/contact", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast({
          title: "Message sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to send message.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "An error occurred while sending your message. Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="odl-container text-center">
            <h1 className="mb-6 text-slate-900 text-4xl font-bold">Contact Us</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Have questions about our courses or platform? We're here to help! Reach out to our team for assistance.
            </p>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-16 bg-white">
          <div className="odl-container">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="What is this regarding?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us how we can help you..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-odl-primary hover:bg-odl-primary/90">
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-odl-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-slate-600 mb-1">General Inquiries:</p>
                      <p className="text-odl-primary">prasannabasava144@gmail.com</p>
                      <p className="text-slate-600 mb-1 mt-2">Student Support:</p>
                      <p className="text-odl-primary">prasannabasava78@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-odl-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-slate-600 mb-1">Main Office:</p>
                      <p className="text-odl-primary">+91 6303088603</p>
                      <p className="text-slate-600 mb-1 mt-2">Technical Support:</p>
                      <p className="text-odl-primary">+91 6303088603</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-odl-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Address</h3>
                      <p className="text-slate-600">
                        Duvva, Andhra Pradesh 534156<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-odl-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Hours of Operation</h3>
                      <p className="text-slate-600">
                        Monday - Friday: 9:00 AM - 6:00 PM (IST)<br />
                        Saturday: 10:00 AM - 2:00 PM (IST)<br />
                        Sunday: Closed
                      </p>
                      <p className="text-slate-500 mt-2 text-sm italic">
                        Online support available 24/7 through our help center.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-slate-50">
          <div className="odl-container">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold">Visit Our Campus</h2>
              <p className="text-slate-600 mt-2">
                While we're primarily an online platform, we invite you to visit our campus in Duvva, Andhra Pradesh.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md aspect-[16/9] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30561.139531809175!2d81.60397734553712!3d16.769587417853817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37b6679b7f470b%3A0x221ed11e73b1c132!2sDuvva%2C%20Andhra%20Pradesh%20534156!5e0!3m2!1sen!2sin!4v1748349264246!5m2!1sen!2sin"
                width="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map of Duvva, Andhra Pradesh"
                aria-label="Map showing the location of Pathway Academy in Duvva, Andhra Pradesh, India"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white" id="faq">
          <div className="odl-container">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Have more questions? Here are some common inquiries we receive.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">How do I enroll in a course?</h3>
                <p className="text-slate-600">
                  Enrolling is easy! Browse our course catalog, select a course, and click the "Enroll" button. You'll
                  be guided through the process, including payment options if it's a paid course.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Can I access courses on mobile devices?</h3>
                <p className="text-slate-600">
                  Yes! Our platform is fully responsive and works on smartphones and tablets. We also offer dedicated
                  mobile apps for iOS and Android for an enhanced learning experience.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Are certificates provided upon completion?</h3>
                <p className="text-slate-600">
                  Absolutely. Upon successful completion of a course, you'll receive a digital certificate that you can
                  add to your resume, share on LinkedIn, or print for your records.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-slate-600">
                  We accept all major credit cards, PayPal, and bank transfers. For some regions, we also offer
                  alternative payment methods. Corporate or bulk enrollment options are available too.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-slate-600">
                Still have questions?{" "}
                <a href="/faq" className="text-odl-primary font-medium hover:underline">
                  Check our complete FAQ page
                </a>{" "}
                or contact us directly.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;