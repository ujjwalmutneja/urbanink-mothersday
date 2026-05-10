import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../images/image1.png";
import img2 from "../images/image2.png";
import img3 from "../images/image3.png";
import img4 from "../images/image4.png";
import img5 from "../images/image5.png";

const images = [img1, img2, img3, img4, img5];

export default function MothersDay() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isClient) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#070502] text-white flex flex-col justify-between font-sans">
      {/* Golden Glowing Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-[#070502] to-[#070502]" />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: Math.random() * 100 + "%",
              x: Math.random() * 100 + "%",
              opacity: Math.random() * 0.6 + 0.2,
              scale: Math.random() * 0.6 + 0.4,
            }}
            animate={{
              y: [null, Math.random() * 100 + "%"],
              opacity: [null, Math.random() * 0.8 + 0.4, Math.random() * 0.5 + 0.2],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_12px_3px_rgba(251,191,36,0.8)]"
            style={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* Top Header */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-50">
        <h1 className="text-xs md:text-sm text-amber-200/60 tracking-[0.3em] uppercase font-light">
          7. Memories Gallery
        </h1>
      </div>

      {/* 3D Carousel Container */}
      <div className="relative flex-1 flex items-center justify-center w-full" style={{ perspective: "1500px" }}>
        {/* Nav Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-2 md:left-12 z-50 p-3 md:p-4 rounded-full border border-amber-500/20 text-amber-500/70 hover:bg-amber-500/10 hover:border-amber-400 hover:text-amber-400 transition-all backdrop-blur-md"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-2 md:right-12 z-50 p-3 md:p-4 rounded-full border border-amber-500/20 text-amber-500/70 hover:bg-amber-500/10 hover:border-amber-400 hover:text-amber-400 transition-all backdrop-blur-md"
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel Items */}
        <div className="relative w-full max-w-6xl h-[60vh] flex items-center justify-center mt-8 md:mt-12" style={{ transformStyle: "preserve-3d" }}>
          {images.map((img, index) => {
            // Determine relative position
            let offset = index - activeIndex;
            // Wrap around for infinite carousel
            if (offset < -2) offset += images.length;
            if (offset > 2) offset -= images.length;

            const isActive = offset === 0;
            const isLeft = offset < 0;
            const isRight = offset > 0;
            const absOffset = Math.abs(offset);

            // 3D transforms
            const zIndex = 10 - absOffset;
            const scale = isActive ? 1 : 1 - absOffset * 0.15;
            // Adjust X translation distance
            const baseTranslate = typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 250;
            const translateX = offset * baseTranslate;
            
            // Angling the side items
            const rotateY = isLeft ? 35 : isRight ? -35 : 0;
            const opacity = absOffset > 2 ? 0 : isActive ? 1 : 0.4;

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  x: translateX,
                  scale: scale,
                  rotateY: rotateY,
                  zIndex: zIndex,
                  opacity: opacity,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.32, 0.72, 0, 1], // Custom cinematic easing
                }}
                className={`absolute w-[200px] h-[280px] md:w-[320px] md:h-[450px] rounded-2xl overflow-hidden border transition-all duration-700 ${
                  isActive
                    ? "border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.3)]"
                    : "border-amber-600/30 shadow-2xl"
                }`}
                style={{
                  filter: isActive ? "blur(0px) brightness(1.1)" : "blur(1px) brightness(0.6)",
                }}
              >
                <img
                  src={img}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Glow ring inside */}
                {isActive && (
                  <div className="absolute inset-0 border-[1px] border-amber-200/50 rounded-2xl pointer-events-none mix-blend-overlay" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Typography */}
      <div className="relative z-50 flex flex-col items-center justify-end pb-10 w-full text-center">
        <h2 
          className="text-3xl md:text-5xl mb-1 text-amber-100/90 drop-shadow-[0_0_15px_rgba(253,230,138,0.4)] tracking-wide"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Every moment...
        </h2>
        <h3 
          className="text-4xl md:text-6xl text-amber-300/80 mb-6 drop-shadow-[0_0_20px_rgba(253,230,138,0.3)]"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Every love...
        </h3>
        
        {/* Heart Icon */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-4"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}