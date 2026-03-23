"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative h-screen min-h-[800px] flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle Interactive Ambient Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] bg-[#7C3AED] opacity-10 pointer-events-none"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.5 }}
      />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium tracking-wide text-white/70 backdrop-blur-md">
            NEUROFLOW AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-8"
        >
          Stop Using Software.
          <br className="hidden md:block" /> Start Getting Work Done.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xl md:text-2xl text-white/50 font-light max-w-2xl mb-12"
        >
          NeuroFlow turns your intent into execution. The first system built to replace manual digital work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Link href="/dashboard">
            <button suppressHydrationWarning className="group relative px-8 py-4 rounded-full bg-white text-black font-semibold text-lg overflow-hidden transition-transform active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Try the system
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#e2e2e2] to-[#c2c2c2] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}
