import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  label: string;
  title: string;
  description: string;
}

export default function SectionHeader({ label, title, description }: SectionHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const labelEl = labelRef.current;
    const titleEl = titleRef.current;
    const descEl = descRef.current;

    if (!header || !labelEl || !titleEl || !descEl) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.fromTo(labelEl, 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo(titleEl,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo(descEl,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.6'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={headerRef} className="flex flex-col items-center text-center max-w-3xl mx-auto">
      <p 
        ref={labelRef}
        className="text-xs font-mono tracking-[0.2em] text-cyan-400 mb-6 uppercase"
      >
        {label}
      </p>
      <h2 
        ref={titleRef}
        className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-8 leading-tight"
      >
        {title}
      </h2>
      <p 
        ref={descRef}
        className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl"
      >
        {description}
      </p>
    </div>
  );
}
