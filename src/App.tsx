/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import HeroSection from './components/HeroSection';

export default function App() {
  return (
    <main className="bg-slate-950 text-white min-h-[200vh]">
      <HeroSection />
      
      {/* Dummy Next Section to allow scrolling */}
      <section className="h-screen flex items-center justify-center bg-slate-900 border-t border-slate-800">
        <div className="text-center max-w-3xl px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            The Next Chapter
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            As you scroll, the ribbon gracefully exits upward, revealing the content below. 
            This creates a seamless transition between the hero and the rest of the experience.
          </p>
        </div>
      </section>
    </main>
  );
}
