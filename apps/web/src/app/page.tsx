"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, Calendar, ShoppingCart, 
  Settings, ArrowRight, Hotel, Sparkles, CheckCircle2,
  BarChart3, LayoutGrid, Smartphone, ShieldCheck, Lock
} from "lucide-react";
import FeaturesPath from "../components/landing/FeaturesPath";
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', email: '', propertyName: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/support/sales-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${contactForm.firstName} ${contactForm.lastName}`,
          email: contactForm.email,
          propertyName: contactForm.propertyName,
          message: contactForm.message,
        })
      });
      if (!res.ok) throw new Error('Failed to submit');
      setContactStatus('success');
      setContactForm({ firstName: '', lastName: '', email: '', propertyName: '', message: '' });
    } catch (err) {
      setContactStatus('error');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#050B14] text-gray-200 font-sans selection:bg-[#CA9851]/30 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#0B1D33]/60 blur-[130px]" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-[#CA9851]/12 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0B1D33]/50 blur-[130px]" />
      </div>

      {/* Glassmorphic Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#070F1E]/85 backdrop-blur-md border-b border-[#CA9851]/15 py-3.5 shadow-lg shadow-black/20" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/yarvo-logo-dark-horizontal.png" 
              alt="Yarvo Hotel - Smarter Hotel Management" 
              onError={(e) => {
                e.currentTarget.src = "/yarvo-logo-dark.jpg";
              }}
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#features-path" className="hover:text-[#DFB776] transition-colors">Features</Link>
            <Link href="#platform" className="hover:text-[#DFB776] transition-colors">Platform</Link>
            <Link href="#pricing" className="hover:text-[#DFB776] transition-colors">Pricing</Link>
            <Link href="#contact" className="hover:text-[#DFB776] transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-bold bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] text-[#070F1E] px-5 sm:px-6 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(202,152,81,0.3)] hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto text-center relative"
        >
          {/* Floating Images (Desktop only) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
            {/* Top Left: Room */}
            <motion.div 
              animate={{ y: [-15, 15] }} 
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 4, ease: "easeInOut" }}
              className="absolute top-[10%] -left-[15%] w-48 h-64 rounded-2xl overflow-hidden border border-[#CA9851]/25 shadow-[0_0_40px_rgba(202,152,81,0.15)] rotate-[-6deg]"
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=300&q=80" alt="Luxury Room" className="w-full h-full object-cover" />
            </motion.div>
            
            {/* Bottom Left: Lobby */}
            <motion.div 
              animate={{ y: [15, -15] }} 
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[-10%] left-[0%] w-40 h-40 rounded-2xl overflow-hidden border border-[#CA9851]/25 shadow-[0_0_40px_rgba(202,152,81,0.15)] rotate-[8deg]"
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=300&q=80" alt="Hotel Lobby" className="w-full h-full object-cover" />
            </motion.div>

            {/* Top Right: Restaurant */}
            <motion.div 
              animate={{ y: [-20, 20] }} 
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[5%] -right-[10%] w-56 h-48 rounded-2xl overflow-hidden border border-[#CA9851]/25 shadow-[0_0_40px_rgba(202,152,81,0.15)] rotate-[5deg]"
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80" alt="Restaurant" className="w-full h-full object-cover" />
            </motion.div>

            {/* Bottom Right: Bar / Pool */}
            <motion.div 
              animate={{ y: [10, -10] }} 
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 3.5, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-[-5%] -right-[15%] w-48 h-56 rounded-2xl overflow-hidden border border-[#CA9851]/25 shadow-[0_0_40px_rgba(202,152,81,0.15)] rotate-[-4deg]"
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80" alt="Resort Pool" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CA9851]/10 border border-[#CA9851]/30 text-xs font-semibold text-[#DFB776] mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(202,152,81,0.15)]">
              <Sparkles size={14} className="text-[#CA9851]" />
              <span>Smarter Hotel Management</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.1] text-white mb-8">
              Run your property.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E9C78C] via-[#CA9851] to-[#B3823E]">Your exact way.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Yarvo is a strictly modular Property Management System. Choose only the features you need, build your perfect platform, and scale without boundaries.
            </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] text-[#070F1E] rounded-full font-bold hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-[0_0_35px_rgba(202,152,81,0.35)]">
              Start Building Free <ArrowRight size={20} />
            </Link>
            <Link href="#contact" className="w-full sm:w-auto px-8 py-4 bg-[#0B1D33]/40 text-white border border-[#CA9851]/30 hover:border-[#CA9851]/70 rounded-full font-bold hover:bg-[#0B1D33]/80 transition-all flex items-center justify-center">
              Book a Demo
            </Link>
          </div>
          </div>
        </motion.section>

        {/* Dashboard Preview / Mockup */}
        <motion.section 
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
          className="max-w-6xl mx-auto mt-20 px-4 sm:px-6 relative perspective-[2000px]"
        >
          {/* Ambient Golden Glow Behind Mockup */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#DFB776]/15 via-[#CA9851]/25 to-[#B3823E]/15 rounded-[2.5rem] blur-3xl opacity-70 pointer-events-none" />

          {/* Luxury Window Container */}
          <div className="relative rounded-[2rem] p-2 sm:p-2.5 bg-gradient-to-b from-[#0B1D33]/90 via-[#070F1E]/95 to-[#050B14] border border-[#CA9851]/30 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_50px_rgba(202,152,81,0.15)] transform rotate-x-[2deg] hover:rotate-x-0 hover:scale-[1.01] transition-all duration-700 overflow-hidden group">
            
            {/* Top Browser Chrome Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#070F1E] border-b border-[#CA9851]/20 rounded-t-[1.6rem]">
              {/* Traffic Light Dots */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                <span className="w-3 h-3 rounded-full bg-[#CA9851]/80 shadow-[0_0_8px_rgba(202,152,81,0.4)]" />
                <span className="w-3 h-3 rounded-full bg-[#10B981]/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              </div>

              {/* Centered URL Bar */}
              <div className="hidden sm:flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#050B14]/90 border border-[#CA9851]/25 text-xs text-gray-300 font-mono tracking-wide shadow-inner">
                <Lock size={12} className="text-[#CA9851]" />
                <span className="text-[#DFB776] font-medium">yarvohotel.app</span>
                <span className="text-gray-500">/dashboard</span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[11px] font-semibold text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>Live PMS</span>
              </div>
            </div>

            {/* Dashboard Display */}
            <div className="relative overflow-hidden rounded-b-[1.5rem] bg-[#070F1E]">
              <img 
                src="/yarvo-dashboard-hero.png" 
                alt="Yarvo Hotel Luxury Dashboard" 
                className="w-full h-auto rounded-b-[1.5rem] block transition-all duration-500 group-hover:scale-[1.005]"
              />
              {/* Subtle bottom fade for seamless transition */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050B14] via-[#050B14]/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.section>


        {/* Modular Features Winding Path */}
        <FeaturesPath />

        {/* Platform Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="platform" 
          className="max-w-7xl mx-auto mt-32 border-t border-white/5 pt-32"
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CA9851]/10 border border-[#CA9851]/30 text-xs font-semibold text-[#DFB776] mb-8 backdrop-blur-md">
                <Settings size={14} className="text-[#CA9851]" />
                <span>The Platform</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                One Unified Core.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E]">Infinite Possibilities.</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Unlike legacy systems that duct-tape different software together, Yarvo is built on a single, unified database. Whether a guest buys a drink at the bar, books a spa session, or extends their stay—everything syncs in real-time to their central folio.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time bidirectional syncing across all modules",
                  "Single source of truth for guest profiles",
                  "Bank-grade encryption and tenant data isolation",
                  "Open API for custom third-party integrations"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <div className="mt-1 w-5 h-5 rounded-full bg-[#CA9851]/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-[#DFB776] rounded-full" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#CA9851]/15 to-[#0B1D33]/40 blur-[80px] rounded-full" />
               <div className="relative bg-[#070F1E] border border-[#CA9851]/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                 <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                   <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-500/80" />
                     <div className="w-3 h-3 rounded-full bg-[#CA9851]/80" />
                     <div className="w-3 h-3 rounded-full bg-green-500/80" />
                   </div>
                   <div className="text-xs font-mono text-gray-400">api/v1/guests/sync</div>
                 </div>
                 <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                   <code dangerouslySetInnerHTML={{__html: `
<span class="text-[#DFB776]">const</span> <span class="text-blue-400">syncFolio</span> = <span class="text-[#DFB776]">async</span> (charge) => {
  <span class="text-gray-500">// 1. Process POS charge</span>
  <span class="text-[#DFB776]">await</span> pos.<span class="text-[#CA9851]">process</span>(charge);

  <span class="text-gray-500">// 2. Instantly route to guest room</span>
  <span class="text-[#DFB776]">await</span> pms.<span class="text-[#CA9851]">routeToRoom</span>({
    roomId: charge.roomId,
    amount: charge.amount,
    timestamp: <span class="text-[#E9C78C]">Date.now()</span>
  });

  <span class="text-[#DFB776]">return</span> { <span class="text-green-400">status</span>: <span class="text-[#E9C78C]">"SYNCED_SUCCESSFULLY"</span> };
};
                   `}} />
                 </pre>
               </div>
            </div>
          </div>
        </motion.section>

        {/* How it Works Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mt-32 border-t border-white/5 pt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get started in minutes.</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">No complex onboarding, no forced 6-month implementations. Go live on your own terms.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#CA9851]/40 to-transparent" />
            
            {[
              { step: "01", title: "Create your property", desc: "Sign up instantly. Enter your property details and room configurations in a simple wizard." },
              { step: "02", title: "Select your modules", desc: "Toggle exactly which features you need. Skip the bloatware and keep your interface clean." },
              { step: "03", title: "Go live seamlessly", desc: "Import your legacy reservations, add your staff members, and start accepting bookings." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 bg-[#070F1E] border border-white/10 hover:border-[#CA9851]/30 rounded-3xl p-8 text-center transition-all">
                <div className="w-16 h-16 bg-[#CA9851]/15 border border-[#CA9851]/30 text-[#DFB776] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-[0_0_20px_rgba(202,152,81,0.2)]">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>


        {/* Testimonials Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mt-32 border-t border-white/5 pt-32"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">Don't just take our word for it.</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Since switching to Yarvo, our front desk efficiency has increased by 40%. The modular approach meant we didn't have to train our staff on features we don't even use.", author: "Sarah Jenkins", role: "GM, The Grand Plaza" },
              { quote: "Finally, a PMS that feels like it was built in this decade. The real-time POS sync has completely eliminated our night audit discrepancies.", author: "David Chen", role: "Owner, Urban Boutique" },
              { quote: "We migrated from a legacy system we used for 15 years. The transition was flawless, and the data isolation gives our corporate team incredible peace of mind.", author: "Elena Rodriguez", role: "VP Operations, LuxeStays" }
            ].map((testimonial, i) => (
              <div key={i} className="bg-[#070F1E] border border-white/10 hover:border-[#CA9851]/30 rounded-3xl p-8 flex flex-col justify-between transition-all">
                <div className="mb-8">
                  <div className="flex gap-1 mb-4 text-[#CA9851]">
                    {[1,2,3,4,5].map(s => <Sparkles key={s} size={16} className="fill-current" />)}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">"{testimonial.quote}"</p>
                </div>
                <div>
                  <h4 className="text-white font-bold">{testimonial.author}</h4>
                  <span className="text-sm text-gray-500">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mt-32 border-t border-white/5 pt-32"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Do I have to pay for the Core PMS if I only want the POS?", a: "No! Yarvo is completely modular. You can use our POS as a standalone product and ignore the rest, or combine them for a unified experience." },
              { q: "How does the multi-tenancy work?", a: "Every property gets its own securely isolated tenant space in our database. You can manage multiple properties under one master account, but their data never mixes." },
              { q: "Is there a long-term contract?", a: "Absolutely not. We operate on a transparent month-to-month basis. We believe our software should earn your business every single day." },
              { q: "Can I migrate my data from Oracle Opera or Mews?", a: "Yes. Our engineering team provides white-glove migration services for all major legacy PMS platforms to ensure zero downtime." }
            ].map((faq, i) => (
              <details key={i} className="group bg-[#070F1E] border border-white/10 hover:border-[#CA9851]/30 rounded-2xl transition-all">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg text-white group-open:text-[#DFB776] transition-colors">
                  {faq.q}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-400 px-6 pb-6 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="pricing" 
          className="max-w-7xl mx-auto mt-32 border-t border-white/5 pt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Transparent Pricing.</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Pay a flat base rate for the core platform, and add modules a la carte. No hidden fees, no per-user licensing.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Base Plan */}
            <div className="bg-[#070F1E] border border-white/10 hover:border-[#CA9851]/30 rounded-3xl p-8 md:p-10 relative overflow-hidden transition-all">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E]" />
               <h3 className="text-2xl font-bold text-white mb-2">Platform Base</h3>
               <p className="text-gray-400 text-sm mb-6">Everything you need to run a modern property.</p>
               <div className="mb-8 flex items-baseline gap-2">
                 <span className="text-5xl font-extrabold text-white">$149</span>
                 <span className="text-gray-500 font-medium">/ property / mo</span>
               </div>
               
               <ul className="space-y-4 mb-10">
                 {[
                   "Front Desk & Reservations",
                   "Dashboard & Reporting",
                   "Unlimited Users",
                   "Unlimited Devices",
                   "24/7 Priority Support"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                     <CheckCircle2 size={18} className="text-[#CA9851] flex-shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
               <Link href="/signup" className="block w-full py-4 bg-white/5 hover:bg-[#CA9851]/10 border border-white/10 hover:border-[#CA9851]/40 rounded-xl font-bold text-center transition-all hover:text-[#DFB776]">
                 Start 14-Day Free Trial
               </Link>
            </div>

            {/* Modules */}
            <div className="bg-gradient-to-b from-[#0B1D33]/70 to-[#070F1E] border border-[#CA9851]/30 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#CA9851]/10 blur-[80px] rounded-full" />
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold text-white mb-2">Add-on Modules</h3>
                 <p className="text-gray-400 text-sm mb-6">Customize your OS with specialized tools.</p>
                 
                 <div className="space-y-4 mb-10">
                   {[
                     { name: "Point of Sale (POS)", price: "$49/mo" },
                     { name: "Event & Ticketing", price: "$39/mo" },
                     { name: "Inventory Management", price: "$29/mo" },
                     { name: "Finance & Accounting", price: "$59/mo" },
                     { name: "Staff & CRM", price: "$29/mo" }
                   ].map((module, i) => (
                     <div key={i} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                       <span className="text-gray-300 font-medium">{module.name}</span>
                       <span className="text-[#DFB776] font-bold">{module.price}</span>
                     </div>
                   ))}
                 </div>
                 
                 <Link href="/signup" className="block w-full py-4 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] text-[#070F1E] rounded-xl font-bold text-center transition-all shadow-[0_0_20px_rgba(202,152,81,0.35)]">
                   Build Your Plan
                 </Link>
               </div>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="contact" 
          className="max-w-7xl mx-auto mt-32 border-t border-white/5 pt-32 mb-16 px-6"
        >
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CA9851]/10 border border-[#CA9851]/30 text-xs font-semibold text-[#DFB776] mb-8 backdrop-blur-md">
                <Users size={14} className="text-[#CA9851]" />
                <span>Here for you</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Support & Sales.</h2>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-md">
                Have questions about custom implementations, data migration, enterprise pricing, or need technical help? Our team is ready to help you architect the perfect solution.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#CA9851]/10 border border-[#CA9851]/20 rounded-xl flex items-center justify-center text-[#DFB776]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Email Us</h4>
                    <p className="text-gray-400">enterprise@yarvohotel.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#CA9851]/10 border border-[#CA9851]/20 rounded-xl flex items-center justify-center text-[#DFB776]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Call Us</h4>
                    <p className="text-gray-400">+1 (800) 555-0199</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#070F1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#CA9851]/10 blur-[80px] rounded-full pointer-events-none" />
               <form onSubmit={handleContactSubmit} className="relative z-10 space-y-4">
                 {contactStatus === 'success' && (
                   <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl mb-4 text-sm flex items-center gap-2">
                     <CheckCircle2 size={16} /> Thanks! We will be in touch shortly.
                   </div>
                 )}
                 {contactStatus === 'error' && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-4 text-sm">
                     Something went wrong. Please try again.
                   </div>
                 )}

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-gray-300">First Name</label>
                     <input required value={contactForm.firstName} onChange={e => setContactForm({...contactForm, firstName: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] transition-colors" placeholder="John" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-gray-300">Last Name</label>
                     <input required value={contactForm.lastName} onChange={e => setContactForm({...contactForm, lastName: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] transition-colors" placeholder="Doe" />
                   </div>
                 </div>
                 
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-300">Work Email</label>
                   <input required value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] transition-colors" placeholder="john@hotel.com" />
                 </div>
                 
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-300">Property Name</label>
                   <input required value={contactForm.propertyName} onChange={e => setContactForm({...contactForm, propertyName: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] transition-colors" placeholder="The Grand Hotel" />
                 </div>
                 
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-300">Message</label>
                   <textarea required value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] transition-colors resize-none" placeholder="Tell us about your requirements..."></textarea>
                 </div>
                 
                 <button disabled={contactStatus === 'loading'} type="submit" className="w-full py-4 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] disabled:opacity-50 text-[#070F1E] rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(202,152,81,0.3)] mt-2">
                   {contactStatus === 'loading' ? 'Sending...' : 'Send Message'}
                 </button>
               </form>
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto mt-16 mb-24 relative px-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#CA9851] to-[#0B1D33] blur-[120px] opacity-20 pointer-events-none" />
          <div className="relative bg-[#070F1E] border border-[#CA9851]/25 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl">
            {/* Inner glow accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#CA9851] to-transparent opacity-60" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#DFB776] to-transparent opacity-30" />
            
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight relative z-10">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E9C78C] via-[#CA9851] to-[#B3823E]">upgrade?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed relative z-10">
              Join forward-thinking properties today and experience the most advanced, modular property management OS ever built.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] text-[#070F1E] rounded-full font-bold hover:scale-105 transition-all text-lg shadow-[0_0_40px_rgba(202,152,81,0.35)]">
                Create Your Account <ArrowRight size={20} />
              </Link>
              <Link href="#contact" className="w-full sm:w-auto px-10 py-5 bg-[#0B1D33]/40 text-white border border-[#CA9851]/30 hover:border-[#CA9851]/70 rounded-full font-bold hover:bg-[#0B1D33]/70 transition-all text-lg flex justify-center items-center">
                Talk to Sales
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 mt-8 relative z-10">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>
        </motion.section>

      </div>

      {/* Footer */}
      <footer className="border-t border-[#CA9851]/15 py-12 relative z-10 bg-[#050B14]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="/yarvo-logo-dark-horizontal.png" 
              alt="Yarvo Hotel - Smarter Hotel Management" 
              onError={(e) => {
                e.currentTarget.src = "/yarvo-logo-dark.jpg";
              }}
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-[#DFB776] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#DFB776] transition-colors">Terms of Service</Link>
            <Link href="#contact" className="hover:text-[#DFB776] transition-colors">Support & Sales</Link>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Yarvo Hotel. Smarter Hotel Management. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
