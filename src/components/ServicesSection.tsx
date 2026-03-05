import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from './SectionHeader';
import ServiceCard from './ServiceCard';
import { 
  PenTool, 
  Code2, 
  BrainCircuit, 
  Cloud, 
  Search, 
  TrendingUp 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: PenTool,
    title: 'Product Design',
    description: 'We craft intuitive, user-centric interfaces that blend aesthetics with seamless functionality.'
  },
  {
    icon: Code2,
    title: 'Web Development',
    description: 'High-performance, scalable web applications built with modern frameworks and best practices.'
  },
  {
    icon: BrainCircuit,
    title: 'AI Solutions',
    description: 'Integrating intelligent machine learning models to automate and elevate your business.'
  },
  {
    icon: Cloud,
    title: 'Cloud Systems',
    description: 'Robust cloud architectures designed for security, scalability, and maximum uptime.'
  },
  {
    icon: Search,
    title: 'UX Research',
    description: 'Data-driven insights to understand your users and validate product decisions.'
  },
  {
    icon: TrendingUp,
    title: 'Digital Strategy',
    description: 'Comprehensive roadmaps to navigate digital transformation and drive growth.'
  }
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !bg || cards.length === 0) return;

    // Background Parallax
    gsap.to(bg, {
      y: '15%',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Cards Staggered Entrance
    gsap.fromTo(cards, 
      { 
        y: 100, 
        opacity: 0,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Cards Parallax (moving slightly faster than scroll)
    gsap.to(cards, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-screen py-32 px-6 md:px-12 lg:px-24 bg-[#020617] overflow-hidden"
    >
      {/* Subtle Noise / Gradient Background */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 128, 255, 0.15) 0%, transparent 70%)'
        }}
      />

      {/* Faint glowing ribbon trail from previous section */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader 
          label="WHAT WE DO"
          title="We design and build digital products that scale."
          description="From concept to deployment, we partner with ambitious brands to create transformative digital experiences."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
