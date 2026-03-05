/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';

export default function App() {
  return (
    <main className="bg-slate-950 text-white min-h-screen">
      <HeroSection />
      <ServicesSection />
    </main>
  );
}
