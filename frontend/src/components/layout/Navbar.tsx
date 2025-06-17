// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Search, Menu, X, BookOpen, ChevronDown } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
//       <div className="odl-container py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2">
//             <BookOpen className="h-6 w-6 text-odl-primary" />
//             <span className="text-xl font-bold">Pathway Academy</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-8">
//             <Link to="/" className="text-foreground hover:text-odl-primary transition-colors">
//               Home
//             </Link>
//             <div className="relative group">
//               <button className="flex items-center gap-1 text-foreground hover:text-odl-primary transition-colors">
//                 Courses <ChevronDown className="h-4 w-4" />
//               </button>
//               <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
//                 <Link
//                   to="/courselist"
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 >
//                   All Courses
//                 </Link>
//                 <Link
//                   to="/courselist"
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 >
//                   Technology
//                 </Link>
//                 <Link
//                   to="/courselist"
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 >
//                   Business
//                 </Link>
//                 <Link
//                   to="/courselist"
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 >
//                   Arts & Humanities
//                 </Link>
//               </div>
//             </div>
//             <Link to="/about" className="text-foreground hover:text-odl-primary transition-colors">
//               About
//             </Link>
//             <Link to="/contact" className="text-foreground hover:text-odl-primary transition-colors">
//               Contact
//             </Link>
//             <div className="relative">
//               <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 className="pl-10 pr-4 py-2 w-64 rounded-full bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
//               />
//             </div>
//           </div>

//           {/* Auth Buttons */}
//           <div className="hidden md:flex items-center gap-4">
//             <Link to="/login">
//               <Button variant="outline" className="rounded-full">
//                 Log In
//               </Button>
//             </Link>
//             <Link to="/signup">
//               <Button className="rounded-full bg-odl-primary hover:bg-odl-primary/90">
//                 Sign Up
//               </Button>
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? (
//               <X className="h-6 w-6 text-foreground" />
//             ) : (
//               <Menu className="h-6 w-6 text-foreground" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 space-y-4 animate-fade-in">
//             <div className="relative">
//               <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 className="w-full pl-10 pr-4 py-2 rounded-full bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
//               />
//             </div>
//             <div className="flex flex-col space-y-3">
//               <Link
//                 to="/"
//                 className="text-foreground hover:text-odl-primary transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Home
//               </Link>
//               <DropdownMenu>
//                 <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-odl-primary transition-colors">
//                   Courses <ChevronDown className="h-4 w-4" />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem>
//                     <Link to="/courses" onClick={() => setIsMenuOpen(false)}>
//                       All Courses
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Link to="/courses/category/technology" onClick={() => setIsMenuOpen(false)}>
//                       Technology
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Link to="/courses/category/business" onClick={() => setIsMenuOpen(false)}>
//                       Business
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Link to="/courses/category/arts" onClick={() => setIsMenuOpen(false)}>
//                       Arts & Humanities
//                     </Link>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <Link
//                 to="/about"
//                 className="text-foreground hover:text-odl-primary transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 About
//               </Link>
//               <Link
//                 to="/contact"
//                 className="text-foreground hover:text-odl-primary transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Contact
//               </Link>
//             </div>
//             <div className="flex flex-col space-y-3">
//               <Link to="/login">
//                 <Button variant="outline" className="w-full">
//                   Log In
//                 </Button>
//               </Link>
//               <Link to="/signup">
//                 <Button className="w-full bg-odl-primary hover:bg-odl-primary/90">
//                   Sign Up
//                 </Button>
//               </Link>
//               <Link to="/login">
//                 <Button className="w-full bg-odl-primary hover:bg-odl-primary/90">
//                   Login
//                 </Button>
//               </Link>
//               <div className="text-right text-sm mt-2">
//                 <Link to="/forgot-password" className="text-blue-600 hover:underline">
//                   Forgot Password?
//                 </Link>
//               </div>

//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, BookOpen, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-odl-primary" />
            <span className="text-lg md:text-lg lg:text-xl font-bold">Pathway Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className="text-foreground hover:text-odl-primary transition-colors md:text-sm lg:text-base">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-odl-primary transition-colors md:text-sm lg:text-base">
                Courses <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem className="md:text-sm lg:text-base">
                  <Link to="/courselist" className="w-full">
                    All Courses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="md:text-sm lg:text-base">
                  <Link to="/courselist/category/technology" className="w-full">
                    Technology
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="md:text-sm lg:text-base">
                  <Link to="/courselist/category/business" className="w-full">
                    Business
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="md:text-sm lg:text-base">
                  <Link to="/courselist/category/arts" className="w-full">
                    Arts & Humanities
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/about" className="text-foreground hover:text-odl-primary transition-colors md:text-sm lg:text-base">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-odl-primary transition-colors md:text-sm lg:text-base">
              Contact
            </Link>
            <div className="relative w-full max-w-xs">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 md:placeholder:text-sm lg:placeholder:text-base"
                aria-label="Search courses"
              />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" className="rounded-full md:text-sm lg:text-base">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="rounded-full bg-odl-primary hover:bg-odl-primary/90 md:text-sm lg:text-base">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-sm"
                aria-label="Search courses"
              />
            </div>
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-foreground hover:text-odl-primary transition-colors text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-odl-primary transition-colors text-base">
                  Courses <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="text-base">
                    <Link to="/courselist" onClick={() => setIsMenuOpen(false)} className="w-full">
                      All Courses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-base">
                    <Link to="/courselist" onClick={() => setIsMenuOpen(false)} className="w-full">
                      Technology
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-base">
                    <Link to="/courselist" onClick={() => setIsMenuOpen(false)} className="w-full">
                      Business
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-base">
                    <Link to="/courselist" onClick={() => setIsMenuOpen(false)} className="w-full">
                      Arts & Humanities
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                to="/about"
                className="text-foreground hover:text-odl-primary transition-colors text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-foreground hover:text-odl-primary transition-colors text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
            <div className="flex flex-col space-y-3">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full text-base">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-odl-primary hover:bg-odl-primary/90 text-base">
                  Sign Up
                </Button>
              </Link>
              <div className="text-right text-sm md:text-xs">
                <Link to="/forgot-password" className="text-blue-600 hover:underline" onClick={() => setIsMenuOpen(false)}>
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;