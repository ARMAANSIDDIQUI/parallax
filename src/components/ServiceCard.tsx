import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ icon: Icon, title, description }, ref) => {
    return (
      <div
        ref={ref}
        className="group relative flex flex-col p-8 md:p-10 bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:bg-slate-800/50 hover:border-slate-700/80 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-xl rounded-3xl" />
        </div>

        {/* Icon Container */}
        <div className="relative z-10 w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-8 border border-slate-700/50 shadow-inner group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors duration-500">
          <Icon className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors duration-500 group-hover:rotate-12" />
        </div>

        <div className="relative z-10">
          <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight group-hover:text-emerald-50 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    );
  }
);

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
