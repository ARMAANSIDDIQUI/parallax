import React, { useRef, useState, useEffect } from 'react';
import RibbonScene from './RibbonScene';
import ScrollController from './ScrollController';
import { Menu, ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const scrollProgress = useRef(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const ribbonContainerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-screen overflow-hidden bg-[#020617] text-white">
      {/* Background Layer */}
      <div
        ref={bgRef}
        className="absolute -inset-[20%] z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-[#020617] opacity-80"
        style={{
          background: 'radial-gradient(circle at center, #0f172a 0%, #020617 70%)'
        }}
      />

      {/* 3D Ribbon Layer */}
      <div ref={ribbonContainerRef} className="absolute inset-0 z-10">
        <RibbonScene scrollProgress={scrollProgress} isMobile={isMobile} />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 pointer-events-none">

        <header className="flex justify-between items-center pointer-events-auto">
          <div className="flex items-center gap-3">
            <img src="/logo.webp" alt="GoZoom Logo" className="h-8 md:h-10 w-auto object-contain" />
            {/* <span className="text-xl md:text-2xl font-bold tracking-tighter text-white">GOZOOM</span> */}
          </div>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Center Content */}
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center pointer-events-auto">
          <div ref={textRef}>
            {/*<button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-medium tracking-wide backdrop-blur-sm">
              Start a Project
            </button>*/}
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-end pointer-events-auto">
          <div className="text-sm text-gray-400 font-mono tracking-widest uppercase">
            Since 2022
          </div>
          <div className="flex flex-col items-center gap-2 text-gray-400 animate-bounce">
            <span className="text-xs font-mono uppercase tracking-widest">Scroll Down</span>
            <ArrowDown className="w-4 h-4" />
          </div>
        </footer>
      </div>

      <ScrollController
        scrollProgress={scrollProgress}
        heroRef={heroRef}
        textRef={textRef}
        bgRef={bgRef}
      />
    </section>
  );
}
