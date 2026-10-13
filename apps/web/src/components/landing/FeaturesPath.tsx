'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, Calendar, ShoppingCart, Users, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const modularFeatures = [
  {
    id: 'pms',
    title: 'Property Management (PMS)',
    desc: 'The core engine. Manage reservations, front desk operations, housekeeping, and billing in one unified interface.',
    icon: Calendar,
    color: 'from-[#DFB776] to-[#CA9851]',
    shadow: 'shadow-[#CA9851]/20'
  },
  {
    id: 'pos',
    title: 'Point of Sale (POS)',
    desc: 'Run your restaurant, bar, and retail shops. Send charges directly to guest rooms instantly with zero sync delay.',
    icon: ShoppingCart,
    color: 'from-[#CA9851] to-[#B3823E]',
    shadow: 'shadow-[#CA9851]/20'
  },
  {
    id: 'events',
    title: 'Events & Banqueting',
    desc: 'Architect beautiful events. Manage space inventory, catering orders, and group room blocks seamlessly.',
    icon: Settings,
    color: 'from-[#DFB776] to-[#E9C78C]',
    shadow: 'shadow-[#DFB776]/20'
  },
  {
    id: 'staff',
    title: 'Staff & Payroll',
    desc: 'Empower your team. Track attendance, manage shifts, and calculate payroll directly inside your PMS.',
    icon: Users,
    color: 'from-[#CA9851] to-[#94672B]',
    shadow: 'shadow-[#CA9851]/20'
  }
];

export default function FeaturesPath() {
  return (
    <section id="features-path" className="relative py-20 sm:py-32 overflow-hidden bg-[#050B14] border-t border-white/5">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#CA9851]/10 to-transparent hidden md:block" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-24 md:mb-32"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CA9851]/10 border border-[#CA9851]/30 text-xs font-medium text-[#DFB776] mb-5 sm:mb-6 backdrop-blur-md">
            <Settings size={14} />
            <span>Modular Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">
            Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E]">perfect system.</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Follow the path and pick exactly what you need. A completely modular street of features designed to scale with your property.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Mobile connecting line */}
          <div className="absolute left-[21px] sm:left-[27px] top-6 bottom-24 w-0.5 sm:w-1 bg-gradient-to-b from-[#CA9851]/40 via-[#DFB776]/50 to-[#CA9851]/40 md:hidden rounded-full" />
          
          {modularFeatures.map((feature, index) => {
            const isEven = index % 2 === 0;
            const Icon = feature.icon;
            
            return (
              <div key={feature.id} className="relative flex flex-col md:flex-row items-center justify-between mb-16 sm:mb-24 md:mb-32 group">
                
                {/* Desktop curved connection line (SVG) */}
                {index < modularFeatures.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0, pathLength: 0 }}
                    whileInView={{ opacity: 1, pathLength: 1 }}
                    viewport={{ once: true, margin: "-150px" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hidden md:block absolute top-[50%] left-1/2 -translate-x-1/2 w-[50%] h-[100%] pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-500 z-0"
                  >
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      {isEven ? (
                        <path d="M 0,0 C 50,0 50,100 100,100" fill="none" stroke="#CA9851" strokeWidth="2.5" strokeDasharray="6 6" />
                      ) : (
                        <path d="M 100,0 C 50,0 50,100 0,100" fill="none" stroke="#CA9851" strokeWidth="2.5" strokeDasharray="6 6" />
                      )}
                    </svg>
                  </motion.div>
                )}

                {/* Content Block (Left or Right) */}
                <div className={`w-full md:w-[45%] flex ${isEven ? 'md:justify-end' : 'md:order-3 md:justify-start'} pl-13 sm:pl-16 md:pl-0 relative z-10`}>
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`w-full bg-[#070F1E] border border-white/10 hover:border-[#CA9851]/40 transition-all duration-300 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl ${feature.shadow} hover:-translate-y-1.5 relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(202,152,81,0.25)]`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 blur-[50px] rounded-full`} />
                    <h3 className="text-lg sm:text-2xl font-bold text-white mb-2.5 sm:mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm sm:text-lg mb-4 sm:mb-6">{feature.desc}</p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/50 group-hover:text-[#DFB776] transition-colors">
                      <CheckCircle2 size={16} className="text-[#CA9851] flex-shrink-0" /> Choose this module
                    </div>
                  </motion.div>
                </div>

                {/* Center Node */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#070F1E] border-2 sm:border-4 border-[#0B1D33] flex items-center justify-center z-20 shadow-[0_0_20px_rgba(0,0,0,0.8)] md:order-2 transition-transform duration-500 group-hover:scale-110 group-hover:border-[#CA9851]/50`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr ${feature.color} flex items-center justify-center shadow-[0_0_15px_rgba(202,152,81,0.3)]`}>
                    <Icon size={16} className="text-[#070F1E] sm:hidden" />
                    <Icon size={20} className="text-[#070F1E] hidden sm:block" />
                  </div>
                </motion.div>
                
                {/* Empty Space for alignment */}
                <div className={`hidden md:block w-[45%] ${isEven ? 'md:order-3' : 'md:order-1'}`} />
              </div>
            );
          })}

          {/* Finish Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative mt-20 sm:mt-32 md:mt-40 text-center flex flex-col items-center justify-center z-20 px-2 sm:px-0"
          >
            <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-[#CA9851]/40 to-transparent" />
            
            <div className="animate-bounce mb-6 sm:mb-8 bg-[#CA9851]/10 border border-[#CA9851]/20 p-2.5 sm:p-3 rounded-full text-[#DFB776]">
              <ChevronDown size={22} />
            </div>
            
            <div className="bg-gradient-to-b from-[#DFB776] via-[#CA9851] to-[#0B1D33] p-[1.5px] sm:p-[2px] rounded-3xl sm:rounded-[3rem] w-full max-w-2xl mx-auto shadow-[0_0_60px_rgba(202,152,81,0.25)] hover:shadow-[0_0_100px_rgba(202,152,81,0.4)] transition-shadow duration-500">
              <div className="bg-[#070F1E] rounded-[22px] sm:rounded-[3rem] p-6 sm:p-10 md:p-16">
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-6 tracking-tight">Finish line.</h3>
                <p className="text-gray-400 text-sm sm:text-lg md:text-xl mb-6 sm:mb-12 leading-relaxed">
                  You've reached the end of the path. Are you ready to take your custom-built Yarvo platform for a spin?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link href="/signup" className="w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-5 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#CA9851] text-[#070F1E] rounded-full font-bold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-lg shadow-[0_0_30px_rgba(202,152,81,0.35)]">
                    Yes, try it now
                  </Link>
                  <Link href="#contact" className="w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-5 bg-white/5 text-white border border-white/10 hover:border-[#CA9851]/40 rounded-full font-bold hover:bg-white/10 transition-all text-sm sm:text-lg flex items-center justify-center">
                    No, I need more info
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
