// import { Link } from "react-router-dom";
// import { BookOpen, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const Footer = () => {
//   return (
//     <footer className="bg-slate-900 text-white">
//       <div className="odl-container section-padding">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Column 1: Logo and About */}
//           <div className="space-y-4">
//             <Link to="/" className="flex items-center gap-2">
//               <BookOpen className="h-6 w-6 text-odl-primary" />
//               <span className="text-xl font-bold">Pathway Academy</span>
//             </Link>
//             <p className="text-slate-300">
//               Providing accessible and flexible education opportunities for 
//               learners worldwide through our innovative Open and Distance 
//               Learning platform.
//             </p>
//             <div className="flex items-center gap-4">
//               <a href="#" className="text-slate-300 hover:text-odl-primary">
//                 <Facebook className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-slate-300 hover:text-odl-primary">
//                 <Twitter className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-slate-300 hover:text-odl-primary">
//                 <Instagram className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-slate-300 hover:text-odl-primary">
//                 <Linkedin className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-slate-300 hover:text-odl-primary">
//                 <Youtube className="h-5 w-5" />
//               </a>
//             </div>
//           </div>

//           {/* Column 2: Quick Links */}
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold">Quick Links</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors">
//                   Courses
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/about" className="text-slate-300 hover:text-odl-primary transition-colors">
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/instructors" className="text-slate-300 hover:text-odl-primary transition-colors">
//                   Instructors
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/contact" className="text-slate-300 hover:text-odl-primary transition-colors">
//                   Contact Us
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/contact#faq" className="text-slate-300 hover:text-odl-primary transition-colors">
//                   FAQ
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Column 3: Top Categories */}
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold">Top Categories</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors">
//                   Technology
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors">
//                   Business
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors">
//                   Arts & Humanities
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors">
//                   Health & Medicine
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors">
//                   Science
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Column 4: Newsletter */}
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold">Subscribe to Our Newsletter</h4>
//             <p className="text-slate-300">
//               Stay updated with our latest courses and educational resources.
//             </p>
//             <div className="flex flex-col space-y-2">
//               <div className="flex items-center">
//                 <Input 
//                   type="email" 
//                   placeholder="Enter your email" 
//                   className="rounded-l-md rounded-r-none border-r-0 bg-slate-800 border-slate-700 focus:ring-offset-slate-900"
//                 />
//                 <Button className="rounded-l-none bg-odl-primary hover:bg-odl-primary/90">
//                   <Mail className="h-4 w-4" />
//                 </Button>
//               </div>
//               <p className="text-xs text-slate-400">
//                 By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
//           <p>© {new Date().getFullYear()} Pathway Academy. All rights reserved.</p>
//           <div className="mt-2 flex justify-center gap-4">
//             <Link to="/privacy" className="hover:text-odl-primary">
//               Privacy Policy
//             </Link>
//             <Link to="/terms" className="hover:text-odl-primary">
//               Terms of Service
//             </Link>
//             <Link to="/cookies" className="hover:text-odl-primary">
//               Cookie Policy
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { Link } from "react-router-dom";
import { BookOpen, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-odl-primary" />
              <span className="text-base sm:text-lg lg:text-xl font-bold">Pathway Academy</span>
            </Link>
            <p className="text-slate-300 text-sm lg:text-base">
              Providing accessible and flexible education opportunities for 
              learners worldwide through our innovative Open and Distance 
              Learning platform.
            </p>
            <div className="flex items-center gap-3 lg:gap-4">
              <a href="https://facebook.com" className="text-slate-300 hover:text-odl-primary" aria-label="Follow us on Facebook" rel="noopener noreferrer">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="https://twitter.com" className="text-slate-300 hover:text-odl-primary" aria-label="Follow us on Twitter" rel="noopener noreferrer">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="https://instagram.com" className="text-slate-300 hover:text-odl-primary" aria-label="Follow us on Instagram" rel="noopener noreferrer">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="https://linkedin.com" className="text-slate-300 hover:text-odl-primary" aria-label="Follow us on LinkedIn" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="https://youtube.com" className="text-slate-300 hover:text-odl-primary" aria-label="Follow us on YouTube" rel="noopener noreferrer">
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors text-sm lg:text-base">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-odl-primary transition-colors text-sm lg:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="text-slate-300 hover:text-odl-primary transition-colors text-sm lg:text-base">
                  Instructors
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-odl-primary transition-colors text-sm lg:text-base">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/contact#faq" className="text-slate-300 hover:text-odl-primary transition-colors text-sm lg:text-base">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold">Top Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors text-sm lg:text-base">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors text-sm lg:text-base">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors text-sm lg:text-base">
                  Arts & Humanities
                </Link>
              </li>
              <li>
                <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors text-sm lg:text-base">
                  Health & Medicine
                </Link>
              </li>
              <li>
                <Link to="/courselist" className="text-slate-300 hover:text-odl-primary transition-colors text-sm lg:text-base">
                  Science
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold">Subscribe to Our Newsletter</h4>
            <p className="text-slate-300 text-sm lg:text-base">
              Stay updated with our latest courses and educational resources.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center w-full max-w-md">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full rounded-l-md rounded-r-none border-r-0 bg-slate-800 border-slate-700 focus:ring-offset-slate-900 text-sm py-1.5 sm:py-2"
                  aria-label="Email for newsletter"
                />
                <Button className="rounded-l-none bg-odl-primary hover:bg-odl-primary/90 px-3 sm:px-4">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800 text-center text-slate-400 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Pathway Academy. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-3 sm:gap-4">
            <Link to="/privacypolicy" className="hover:text-odl-primary text-xs sm:text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-odl-primary text-xs sm:text-sm">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-odl-primary text-xs sm:text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;