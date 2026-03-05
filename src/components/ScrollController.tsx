import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollControllerProps {
  scrollProgress: React.MutableRefObject<number>;
  heroRef: React.RefObject<HTMLDivElement | null>;
  textRef: React.RefObject<HTMLDivElement | null>;
  bgRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollController({
  scrollProgress,
  heroRef,
  textRef,
  bgRef,
}: ScrollControllerProps) {
  useEffect(() => {
    if (!heroRef.current || !textRef.current || !bgRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      },
    });

    // Parallax Depth Layers
    
    // 1. Background layer: very slow scroll movement
    tl.to(bgRef.current, { y: '20%', ease: 'none' }, 0);
    
    // 2. HTML Text layer (button): medium scroll speed, fades out
    tl.to(textRef.current, { y: 100, opacity: 0, ease: 'none' }, 0);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [heroRef, textRef, bgRef, scrollProgress]);

  return null;
}
