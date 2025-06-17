// import { useEffect, useState } from 'react';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import { Card, CardContent } from "@/components/ui/card";

// interface CarouselImage {
//   src: string;
//   alt: string;
//   caption?: string;
// }

// const ImageCarousel = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [autoplay, setAutoplay] = useState(true);

//   const images: CarouselImage[] = [
//     {
//       src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
//       alt: "Online education",
//       caption: "Learn from anywhere",
//     },
//     {
//       src: "https://images.unsplash.com/photo-1494599948593-3dafe8338d71?auto=format&fit=crop&w=1200&q=80",
//       alt: "Focused study",
//       caption: "Stay Focused, Stay Ahead",
//     },
//     {
//       src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
//       alt: "Student learning online",
//       caption: "Remote learning made easy with Pathway Academy",
//     },
//     {
//       src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
//       alt: "Programming on laptop",
//       caption: "Master coding and technical skills with our expert instructors",
//     },
//     {
//       src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80",
//       alt: "Modern technology",
//       caption: "Stay ahead with cutting-edge curriculum and technologies",
//     },
//     {
//       src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80",
//       alt: "Student studying remotely",
//       caption: "Learn from anywhere, at any time with our flexible courses",
//     },
//   ];

//   // Auto-play logic
//   useEffect(() => {
//     if (!autoplay) return;

//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 3000); // change every 3 seconds

//     return () => clearInterval(interval);
//   }, [autoplay, images.length]);

//   return (
//     <Carousel className="w-full max-w-4xl mx-auto">
//       <CarouselContent>
//         {images.map((image, index) => (
//           <CarouselItem key={index} className={index === currentIndex ? "block" : "hidden"}>
//             <Card className="border-none overflow-hidden">
//               <CardContent className="p-0 relative aspect-video">
//                 <img
//                   src={image.src}
//                   alt={image.alt}
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//                 {image.caption && (
//                   <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
//                     <p className="text-sm md:text-base">{image.caption}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//     </Carousel>
//   );
// };

// export default ImageCarousel;


"use client";

import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

const ImageCarousel = () => {
  const [autoplay, setAutoplay] = useState(true);
  const [api, setApi] = useState(null);

  const images: CarouselImage[] = [
    {
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
      alt: "Online education",
      caption: "Learn from anywhere",
    },
    {
      src: "https://images.unsplash.com/photo-1494599948593-3dafe8338d71?auto=format&fit=crop&w=600&q=80",
      alt: "Focused study",
      caption: "Stay Focused, Stay Ahead",
    },
    {
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      alt: "Student learning online",
      caption: "Remote learning made easy with Pathway Academy",
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
      alt: "Programming on laptop",
      caption: "Master coding and technical skills with our expert instructors",
    },
    {
      src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
      alt: "Modern technology",
      caption: "Stay ahead with cutting-edge curriculum and technologies",
    },
    {
      src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80",
      alt: "Student studying remotely",
      caption: "Learn from anywhere, at any time with our flexible courses",
    },
  ];

  // Autoplay logic
  useEffect(() => {
    if (!api || !autoplay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api, autoplay]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8">
      <Carousel
        className="w-full max-w-full sm:max-w-3xl md:max-w-4xl mx-auto"
        opts={{
          loop: true,
          align: 'center',
          containScroll: 'trimSnaps',
          slidesToScroll: 1,
        }}
        setApi={setApi}
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
        onFocus={() => setAutoplay(false)}
        onBlur={() => setAutoplay(true)}
        aria-label="Featured images of Pathway Academy"
      >
        <CarouselContent className="transition-opacity duration-500">
          {images.map((image, index) => (
            <CarouselItem key={index} className="opacity-100">
              <Card className="border-none overflow-hidden">
                <CardContent className="p-0 relative aspect-[4/3] sm:aspect-video">
                  <picture>
                    <source
                      srcSet={`${image.src}&w=1200`}
                      media="(min-width: 1024px)"
                    />
                    <source
                      srcSet={`${image.src}&w=800`}
                      media="(min-width: 640px)"
                    />
                    <img
                      src={`${image.src}&w=600`}
                      alt={image.alt}
                      className="w-full h-full object-cover object-center rounded-lg"
                      loading={index === 0 ? "eager" : "lazy"}
                      aria-current={index === 0 ? "true" : "false"}
                    />
                  </picture>
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                      <p className="text-xs sm:text-sm lg:text-base text-shadow">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;