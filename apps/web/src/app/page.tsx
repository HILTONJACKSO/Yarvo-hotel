"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, Calendar, ShoppingCart, 
  Settings, ArrowRight, Hotel, Sparkles, CheckCircle2,
  BarChart3, LayoutGrid, Smartphone, ShieldCheck, Lock,
  Menu, X, Bed, CreditCard, ChevronRight, Check
} from "lucide-react";
import FeaturesPath from "../components/landing/FeaturesPath";
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'frontdesk' | 'pos' | 'audit' | 'multi'>('frontdesk');
  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', email: '', propertyName: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#050B14] text-gray-200 font-sans selection:bg-[#CA9851]/30 overflow-x-hidden relative">
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
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen 
            ? "bg-[#070F1E]/95 backdrop-blur-xl border-b border-[#CA9851]/20 py-3 shadow-xl shadow-black/40" 
            : "bg-transparent py-4 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group flex-shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img 
              src="/yarvo-logo-dark-horizontal.png" 
              alt="Yarvo Hotel - Smarter Hotel Management" 
              width={160}
              height={38}
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = "/yarvo-logo-dark.jpg";
              }}
              className="h-7 sm:h-9 md:h-11 w-auto max-w-[130px] xs:max-w-[160px] sm:max-w-none object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-300">
            <Link href="#features-path" className="hover:text-[#DFB776] transition-colors">Features</Link>
            <Link href="#interactive-preview" className="hover:text-[#DFB776] transition-colors">Preview</Link>
            <Link href="#platform" className="hover:text-[#DFB776] transition-colors">Platform</Link>
            <Link href="#pricing" className="hover:text-[#DFB776] transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-[#DFB776] transition-colors">FAQ</Link>
            <Link href="#contact" className="hover:text-[#DFB776] transition-colors">Contact</Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-3 py-2">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-bold bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] text-[#070F1E] px-5 sm:px-6 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(202,152,81,0.3)] hover:scale-105">
              Get Started
            </Link>
          </div>

          {/* Mobile Right Bar: Compact CTA + Hamburger Menu */}
          <div className="flex md:hidden items-center gap-2 xs:gap-3">
            <Link 
              href="/signup" 
              className="text-xs font-bold bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] text-[#070F1E] px-3 py-1.5 xs:px-4 xs:py-2 rounded-full whitespace-nowrap shadow-[0_0_12px_rgba(202,152,81,0.25)] active:scale-95 transition-transform"
            >
              Start Free
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="p-1.5 xs:p-2 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-[#DFB776] hover:border-[#CA9851]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CA9851]/50"
            >
              {mobileMenuOpen ? <X size={20} className="text-[#DFB776]" /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Glassmorphic Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[53px] xs:top-[57px] sm:top-[65px] bottom-0 bg-[#050B14]/98 backdrop-blur-2xl border-t border-[#CA9851]/20 flex flex-col justify-between p-5 overflow-y-auto animate-in fade-in duration-200 z-50">
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#DFB776]/70 px-3 pb-1">
                Navigation
              </div>
              {[
                { label: "Modular Features", href: "#features-path" },
                { label: "Interactive System Preview", href: "#interactive-preview" },
                { label: "Platform Core", href: "#platform" },
                { label: "Pricing & Add-ons", href: "#pricing" },
                { label: "Frequently Asked Questions", href: "#faq" },
                { label: "Support & Sales", href: "#contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#070F1E] border border-white/5 hover:border-[#CA9851]/40 text-gray-200 hover:text-[#DFB776] font-medium transition-colors"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <ChevronRight size={16} className="text-gray-500" />
                </Link>
              ))}
            </div>

            <div className="pt-6 pb-2 border-t border-white/10 space-y-3">
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] text-[#070F1E] font-bold text-center rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(202,152,81,0.35)] text-sm"
              >
                Start 14-Day Free Trial <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-medium text-center rounded-2xl hover:border-[#CA9851]/40 flex items-center justify-center text-sm"
              >
                Sign In to Property
              </Link>
              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
                <ShieldCheck size={13} className="text-[#CA9851]" />
                <span>Tenant Isolated & Bank-Grade Encrypted</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="relative z-10 pt-24 pb-16 sm:pt-36 sm:pb-24 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8">
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
              <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=300&q=80" alt="Luxury Hotel Suite" width={300} height={200} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </motion.div>
            
            {/* Bottom Left: Lobby */}
            <motion.div 
              animate={{ y: [15, -15] }} 
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[-10%] left-[0%] w-40 h-40 rounded-2xl overflow-hidden border border-[#CA9851]/25 shadow-[0_0_40px_rgba(202,152,81,0.15)] rotate-[8deg]"
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=300&q=80" alt="Modern Hotel Lobby Interior" width={300} height={200} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </motion.div>

            {/* Top Right: Restaurant */}
            <motion.div 
              animate={{ y: [-20, 20] }} 
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[5%] -right-[10%] w-56 h-48 rounded-2xl overflow-hidden border border-[#CA9851]/25 shadow-[0_0_40px_rgba(202,152,81,0.15)] rotate-[5deg]"
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80" alt="Hotel Restaurant and Dining" width={300} height={200} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </motion.div>

            {/* Bottom Right: Bar / Pool */}
            <motion.div 
              animate={{ y: [10, -10] }} 
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 3.5, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-[-5%] -right-[15%] w-48 h-56 rounded-2xl overflow-hidden border border-[#CA9851]/25 shadow-[0_0_40px_rgba(202,152,81,0.15)] rotate-[-4deg]"
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80" alt="Boutique Resort Swimming Pool" width={300} height={200} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#CA9851]/10 border border-[#CA9851]/30 text-xs sm:text-sm font-semibold text-[#DFB776] mb-5 sm:mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(202,152,81,0.15)]">
              <Sparkles size={14} className="text-[#CA9851]" />
              <span>Smarter Hotel Management</span>
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.15] sm:leading-[1.1] text-white mb-4 sm:mb-8">
              Run your property.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E9C78C] via-[#CA9851] to-[#B3823E]">Your exact way.</span>
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-1 sm:px-0">
              Yarvo is a strictly modular Property Management System. Choose only the features you need, build your perfect platform, and scale without boundaries.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
              <Link href="/signup" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] text-[#070F1E] rounded-full font-bold hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base shadow-[0_0_35px_rgba(202,152,81,0.35)]">
                Start Building Free <ArrowRight size={18} />
              </Link>
              <Link href="#contact" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#0B1D33]/40 text-white border border-[#CA9851]/30 hover:border-[#CA9851]/70 rounded-full font-bold hover:bg-[#0B1D33]/80 transition-all flex items-center justify-center text-sm sm:text-base">
                Book a Demo
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-400">
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[#CA9851]" /> 14-day free trial</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[#CA9851]" /> No credit card required</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[#CA9851]" /> Instant cloud setup</span>
            </div>
          </div>
        </motion.section>

        {/* Dashboard Preview / Mockup */}
        <motion.section 
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
          className="max-w-6xl mx-auto mt-12 sm:mt-20 px-1 sm:px-4 relative perspective-[2000px]"
        >
          {/* Ambient Golden Glow Behind Mockup */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#DFB776]/15 via-[#CA9851]/25 to-[#B3823E]/15 rounded-[2.5rem] blur-3xl opacity-70 pointer-events-none" />

          {/* Luxury Window Container */}
          <div className="relative rounded-2xl sm:rounded-[2rem] p-1.5 sm:p-2.5 bg-gradient-to-b from-[#0B1D33]/90 via-[#070F1E]/95 to-[#050B14] border border-[#CA9851]/30 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(202,152,81,0.15)] overflow-hidden group">
            
            {/* Top Browser Chrome Bar */}
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-[#070F1E] border-b border-[#CA9851]/20 rounded-t-xl sm:rounded-t-[1.6rem]">
              {/* Traffic Light Dots */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EF4444]/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#CA9851]/80 shadow-[0_0_8px_rgba(202,152,81,0.4)]" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#10B981]/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              </div>

              {/* Centered URL Bar */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1 sm:py-1.5 rounded-full bg-[#050B14]/90 border border-[#CA9851]/25 text-[11px] sm:text-xs text-gray-300 font-mono tracking-wide shadow-inner">
                <Lock size={11} className="text-[#CA9851]" />
                <span className="text-[#DFB776] font-medium">yarvohotel.com</span>
                <span className="text-gray-500 hidden xs:inline">/dashboard</span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[10px] sm:text-[11px] font-semibold text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>Live PMS</span>
              </div>
            </div>

            {/* Dashboard Display */}
            <div className="relative overflow-hidden rounded-b-xl sm:rounded-b-[1.5rem] bg-[#070F1E]">
              <img 
                src="/yarvo-dashboard-hero.png" 
                alt="Yarvo Hotel Luxury PMS Dashboard Interface" 
                width={2036}
                height={894}
                loading="eager"
                decoding="async"
                className="w-full h-auto rounded-b-xl sm:rounded-b-[1.5rem] block transition-all duration-500 group-hover:scale-[1.005]"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 sm:h-28 bg-gradient-to-t from-[#050B14] via-[#050B14]/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.section>

        {/* KPI Performance Bar */}
        <div className="max-w-6xl mx-auto mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-1 sm:px-4">
          {[
            { value: "99.99%", label: "Cloud Uptime", sub: "Uninterrupted 24/7 guest service" },
            { value: "< 2ms", label: "Instant Sync", sub: "POS to central folio routing" },
            { value: "100%", label: "Tenant Isolation", sub: "Enterprise database security" },
            { value: "0", label: "Legacy Friction", sub: "No hardware or contract locks" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#070F1E]/80 border border-white/5 hover:border-[#CA9851]/30 rounded-2xl p-4 sm:p-5 text-center transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#DFB776] to-[#CA9851] mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mb-0.5">{stat.label}</div>
              <div className="text-[11px] text-gray-500 leading-tight">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Interactive Feature Live Explorer */}
        <section id="interactive-preview" className="max-w-6xl mx-auto mt-24 sm:mt-32 px-1 sm:px-4">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CA9851]/10 border border-[#CA9851]/30 text-xs font-semibold text-[#DFB776] mb-4 backdrop-blur-md">
              <LayoutGrid size={14} className="text-[#CA9851]" />
              <span>Live System Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Built for every department.
            </h2>
            <p className="text-sm sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Explore how Yarvo streamlines your operations with dedicated interfaces built for each hospitality role.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {[
              { id: 'frontdesk', label: 'Front Desk & Folio', icon: Hotel },
              { id: 'pos', label: 'Point of Sale (POS)', icon: ShoppingCart },
              { id: 'audit', label: 'Night Audit & Finance', icon: BarChart3 },
              { id: 'multi', label: 'Multi-Property Admin', icon: Users },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive 
                      ? "bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] text-[#070F1E] shadow-[0_0_20px_rgba(202,152,81,0.35)]" 
                      : "bg-[#070F1E] border border-white/10 text-gray-400 hover:text-white hover:border-[#CA9851]/30"
                  }`}
                >
                  <TabIcon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Cards */}
          <div className="mt-6 bg-[#070F1E] border border-[#CA9851]/25 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#CA9851]/10 blur-[100px] rounded-full pointer-events-none" />
            
            {activeTab === 'frontdesk' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-xs font-mono text-[#DFB776] mb-2 uppercase tracking-wider">Module 01 / Core</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Front Desk & Room Tape Chart</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                    A visual grid of rooms, check-ins, check-outs, and housekeeping statuses. Front desk agents can assign rooms, split guest folios, and print keycards in seconds.
                  </p>
                  <div className="space-y-3">
                    {["Drag-and-drop reservations timeline", "One-click guest check-in & digital reg-cards", "Automated housekeeping status updates", "Split folios for corporate & leisure charges"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-[#CA9851] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#050B14] border border-white/10 rounded-2xl p-5 shadow-inner">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-gray-400">
                    <span className="font-semibold text-white">Live Tape Chart Sample</span>
                    <span className="text-[#10B981] font-mono">92% Occupied</span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {[
                      { room: "Suite 301", guest: "Alexander Wright", status: "Occupied", bg: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
                      { room: "Deluxe 204", guest: "Sarah Jenkins", status: "Arriving Today", bg: "bg-[#CA9851]/15 border-[#CA9851]/30 text-[#DFB776]" },
                      { room: "Ocean 102", guest: "Housekeeping", status: "Clean & Inspected", bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
                      { room: "Villa 005", guest: "VIP Stay", status: "Checked Out", bg: "bg-gray-500/10 border-gray-500/30 text-gray-400" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                        <div>
                          <div className="font-bold text-white">{row.room}</div>
                          <div className="text-gray-400 text-[11px]">{row.guest}</div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${row.bg}`}>
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pos' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-xs font-mono text-[#DFB776] mb-2 uppercase tracking-wider">Module 02 / Revenue</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Integrated Hospitality POS</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                    Turn your bar, restaurant, pool cabanas, and gift shop into instant revenue centers. Servers route charges directly to room folios with zero sync delays.
                  </p>
                  <div className="space-y-3">
                    {["Instant 'Charge to Room' with signature capture", "Multi-table visual floor plans", "Direct Kitchen Display System (KDS) routing", "Automated tip distribution and shift register closeout"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-[#CA9851] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#050B14] border border-white/10 rounded-2xl p-5 shadow-inner">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-gray-400">
                    <span className="font-semibold text-white">Active POS Order #4819</span>
                    <span className="text-[#DFB776] font-mono">Table 14</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs py-1.5 border-b border-white/5 text-gray-300">
                      <span>2x Grilled Sea Bass</span>
                      <span className="font-mono text-white">$68.00</span>
                    </div>
                    <div className="flex justify-between text-xs py-1.5 border-b border-white/5 text-gray-300">
                      <span>1x Reserve Pinot Noir</span>
                      <span className="font-mono text-white">$85.00</span>
                    </div>
                    <div className="flex justify-between text-xs py-1.5 text-gray-300">
                      <span>Tax & Service</span>
                      <span className="font-mono text-white">$15.30</span>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-bold text-sm">
                      <span className="text-white">Total Charge</span>
                      <span className="text-[#DFB776] font-mono">$168.30</span>
                    </div>
                    <div className="mt-3 p-2.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-between text-[11px] text-[#10B981]">
                      <span>Routed to Room 301 (Alexander Wright)</span>
                      <span className="font-semibold font-mono">SYNCED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-xs font-mono text-[#DFB776] mb-2 uppercase tracking-wider">Module 03 / Operations</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Automated Night Audit</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                    Eliminate 4-hour manual night audits. Yarvo automatically reconciles room charges, audits open registers, rolls the hospitality business date, and delivers executive P&L summaries.
                  </p>
                  <div className="space-y-3">
                    {["1-click automated business date roll", "Automatic room rate & tax posting", "Real-time RevPAR, ADR, and Occupancy % metrics", "Audit logs with non-repudiation timestamps"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-[#CA9851] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#050B14] border border-white/10 rounded-2xl p-5 shadow-inner">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-gray-400">
                    <span className="font-semibold text-white">Daily Flash Report</span>
                    <span className="text-[#10B981] font-mono">Date Rolled Successfully</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <div className="text-[11px] text-gray-400">ADR</div>
                      <div className="text-xl font-bold text-[#DFB776] font-mono mt-0.5">$284.50</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <div className="text-[11px] text-gray-400">RevPAR</div>
                      <div className="text-xl font-bold text-[#DFB776] font-mono mt-0.5">$261.74</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <div className="text-[11px] text-gray-400">Occupancy</div>
                      <div className="text-xl font-bold text-white font-mono mt-0.5">92.0%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <div className="text-[11px] text-gray-400">Folio Balance</div>
                      <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">$0.00</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'multi' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-xs font-mono text-[#DFB776] mb-2 uppercase tracking-wider">Module 04 / Enterprise</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Multi-Property Super Admin</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                    Manage 1 to 50+ hotel properties from one master command center. Switch between hotels with zero re-login, maintain global staff permissions, and compare multi-property revenues.
                  </p>
                  <div className="space-y-3">
                    {["Single sign-on across all properties", "Isolated PostgreSQL schemas per property", "Centralized corporate financial rollups", "Global staff onboarding and role assignment"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-[#CA9851] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#050B14] border border-white/10 rounded-2xl p-5 shadow-inner">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-gray-400">
                    <span className="font-semibold text-white">Portfolio Overview</span>
                    <span className="text-[#CA9851] font-mono">3 Active Properties</span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {[
                      { name: "Yarvo Grand Palm Resort", location: "Miami, FL", occ: "94%", rev: "$42.5k" },
                      { name: "Yarvo Alpine Boutique Hotel", location: "Aspen, CO", occ: "88%", rev: "$38.1k" },
                      { name: "The Urban Loft by Yarvo", location: "New York, NY", occ: "96%", rev: "$54.2k" },
                    ].map((prop, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                        <div>
                          <div className="font-bold text-white">{prop.name}</div>
                          <div className="text-gray-400 text-[11px]">{prop.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#DFB776] font-mono font-bold">{prop.rev}</div>
                          <div className="text-gray-500 text-[10px]">{prop.occ} occ</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Modular Features Winding Path */}
        <FeaturesPath />

        {/* Platform Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="platform" 
          className="max-w-7xl mx-auto mt-24 sm:mt-32 border-t border-white/5 pt-20 sm:pt-32 px-1 sm:px-4"
        >
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CA9851]/10 border border-[#CA9851]/30 text-xs font-semibold text-[#DFB776] mb-6 sm:mb-8 backdrop-blur-md">
                <Settings size={14} className="text-[#CA9851]" />
                <span>The Platform</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                One Unified Core.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E]">Infinite Possibilities.</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-400 mb-8 leading-relaxed">
                Unlike legacy systems that duct-tape different software together, Yarvo is built on a single, unified database. Whether a guest buys a drink at the bar, books a spa session, or extends their stay—everything syncs in real-time to their central folio.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time bidirectional syncing across all modules",
                  "Single source of truth for guest profiles",
                  "Bank-grade encryption and tenant data isolation",
                  "Open API for custom third-party integrations"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-300">
                    <div className="mt-1 w-5 h-5 rounded-full bg-[#CA9851]/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-[#DFB776] rounded-full" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#CA9851]/15 to-[#0B1D33]/40 blur-[80px] rounded-full pointer-events-none" />
               <div className="relative bg-[#070F1E] border border-[#CA9851]/20 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
                 <div className="flex items-center gap-3 mb-4 sm:mb-6 border-b border-white/5 pb-4">
                   <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-500/80" />
                     <div className="w-3 h-3 rounded-full bg-[#CA9851]/80" />
                     <div className="w-3 h-3 rounded-full bg-green-500/80" />
                   </div>
                   <div className="text-xs font-mono text-gray-400">api/v1/guests/sync</div>
                 </div>
                 <pre className="text-xs sm:text-sm font-mono text-gray-300 overflow-x-auto">
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
          className="max-w-7xl mx-auto mt-24 sm:mt-32 border-t border-white/5 pt-20 sm:pt-32 px-1 sm:px-4"
        >
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Get started in minutes.</h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">No complex onboarding, no forced 6-month implementations. Go live on your own terms.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#CA9851]/40 to-transparent" />
            
            {[
              { step: "01", title: "Create your property", desc: "Sign up instantly. Enter your property details and room configurations in a simple wizard." },
              { step: "02", title: "Select your modules", desc: "Toggle exactly which features you need. Skip the bloatware and keep your interface clean." },
              { step: "03", title: "Go live seamlessly", desc: "Import your legacy reservations, add your staff members, and start accepting bookings." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 bg-[#070F1E] border border-white/10 hover:border-[#CA9851]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center transition-all">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#CA9851]/15 border border-[#CA9851]/30 text-[#DFB776] rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-5 sm:mb-6 shadow-[0_0_20px_rgba(202,152,81,0.2)]">
                  {item.step}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{item.desc}</p>
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
          className="max-w-7xl mx-auto mt-24 sm:mt-32 border-t border-white/5 pt-20 sm:pt-32 px-1 sm:px-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-12 sm:mb-16 text-center">Don't just take our word for it.</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Since switching to Yarvo, our front desk efficiency has increased by 40%. The modular approach meant we didn't have to train our staff on features we don't even use.", author: "Sarah Jenkins", role: "GM, The Grand Plaza" },
              { quote: "Finally, a PMS that feels like it was built in this decade. The real-time POS sync has completely eliminated our night audit discrepancies.", author: "David Chen", role: "Owner, Urban Boutique" },
              { quote: "We migrated from a legacy system we used for 15 years. The transition was flawless, and the data isolation gives our corporate team incredible peace of mind.", author: "Elena Rodriguez", role: "VP Operations, LuxeStays" }
            ].map((testimonial, i) => (
              <div key={i} className="bg-[#070F1E] border border-white/10 hover:border-[#CA9851]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all">
                <div className="mb-6 sm:mb-8">
                  <div className="flex gap-1 mb-4 text-[#CA9851]">
                    {[1,2,3,4,5].map(s => <Sparkles key={s} size={16} className="fill-current" />)}
                  </div>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed">"{testimonial.quote}"</p>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">{testimonial.author}</h3>
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
          id="faq"
          className="max-w-4xl mx-auto mt-24 sm:mt-32 border-t border-white/5 pt-20 sm:pt-32 px-1 sm:px-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-10 sm:mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { 
                q: "What makes Yarvo a strictly modular Property Management System (PMS)?", 
                a: "Unlike traditional monolithic hotel management software, Yarvo lets you activate only the modules your property needs. Whether you operate a luxury boutique resort needing front desk, unified folio, and housekeeping, or an independent restaurant requiring a high-volume POS, you never pay for or train staff on bloated features you don't use." 
              },
              { 
                q: "Do I have to pay for the Core PMS if I only want the POS or Event module?", 
                a: "No! Yarvo is engineered to be 100% modular. You can deploy our hospitality POS or Event Spaces module as an independent standalone product, or combine them with our Core PMS for instant real-time room folio routing." 
              },
              { 
                q: "How does multi-property management and data isolation work?", 
                a: "Every hotel property is provisioned in its own securely isolated tenant database partition. Multi-property operators and hotel groups can supervise multiple properties, cross-audit revenues, and manage staff roles from a centralized Super Admin control plane with complete data protection." 
              },
              { 
                q: "How does the 14-day free trial work?", 
                a: "You get full, unrestricted access to the complete Yarvo Hotel PMS platform for 14 days without entering a credit card. You can configure room types, test reservations, simulate guest check-ins, and experiment with staff permissions with zero commitment." 
              },
              { 
                q: "Can I migrate existing reservations and guest profiles from Oracle Opera, Cloudbeds, or Mews?", 
                a: "Yes. Yarvo includes automated CSV and Excel import utilities for rooms, guest history, rate plans, and existing bookings. Our engineering specialists also provide white-glove assisted migrations with zero operational downtime for your front desk." 
              },
              { 
                q: "Does Yarvo automate night audits and financial reports?", 
                a: "Yes. Yarvo features an automated end-of-day night audit that balances folios, posts room charges, closes POS registers, and generates comprehensive financial and revenue reports (RevPAR, ADR, Occupancy %) delivered directly to management." 
              },
              { 
                q: "What hardware is required to run Yarvo Hotel PMS?", 
                a: "Yarvo is a modern, responsive web application that runs smoothly on any device with a standard web browser: desktop PCs, MacBooks, iPads, Android tablets, and smartphones. No bulky on-premise servers or specialized hardware required." 
              },
              { 
                q: "Is there a long-term contract or cancellation penalty?", 
                a: "None whatsoever. Yarvo operates on a transparent month-to-month subscription. You can upgrade, add modules, or cancel at any time with complete data export access." 
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-[#070F1E] border border-white/10 hover:border-[#CA9851]/30 rounded-2xl transition-all">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 sm:p-6 text-base sm:text-lg text-white group-open:text-[#DFB776] transition-colors">
                  <span className="pr-4">{faq.q}</span>
                  <span className="transition-transform duration-200 group-open:rotate-180 flex-shrink-0 text-[#CA9851]">
                    <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-400 px-5 pb-5 sm:px-6 sm:pb-6 leading-relaxed text-sm sm:text-base border-t border-white/5 pt-4">
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
          className="max-w-7xl mx-auto mt-24 sm:mt-32 border-t border-white/5 pt-20 sm:pt-32 px-1 sm:px-4"
        >
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Transparent Pricing.</h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">Pay a flat base rate for the core platform, and add modules a la carte. No hidden fees, no per-user licensing.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Base Plan */}
            <div className="bg-[#070F1E] border border-white/10 hover:border-[#CA9851]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden transition-all">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E]" />
               <h3 className="text-2xl font-bold text-white mb-2">Platform Base</h3>
               <p className="text-gray-400 text-sm mb-6">Everything you need to run a modern property.</p>
               <div className="mb-8 flex items-baseline gap-2">
                 <span className="text-4xl sm:text-5xl font-extrabold text-white">$149</span>
                 <span className="text-gray-500 font-medium text-sm sm:text-base">/ property / mo</span>
               </div>
               
               <ul className="space-y-4 mb-8 sm:mb-10">
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
               <Link href="/signup" className="block w-full py-4 bg-white/5 hover:bg-[#CA9851]/10 border border-white/10 hover:border-[#CA9851]/40 rounded-xl font-bold text-center transition-all hover:text-[#DFB776] text-sm sm:text-base">
                 Start 14-Day Free Trial
               </Link>
            </div>

            {/* Modules */}
            <div className="bg-gradient-to-b from-[#0B1D33]/70 to-[#070F1E] border border-[#CA9851]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#CA9851]/10 blur-[80px] rounded-full pointer-events-none" />
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold text-white mb-2">Add-on Modules</h3>
                 <p className="text-gray-400 text-sm mb-6">Customize your OS with specialized tools.</p>
                 
                 <div className="space-y-4 mb-8 sm:mb-10">
                   {[
                     { name: "Point of Sale (POS)", price: "$49/mo" },
                     { name: "Event & Ticketing", price: "$39/mo" },
                     { name: "Inventory Management", price: "$29/mo" },
                     { name: "Finance & Accounting", price: "$59/mo" },
                     { name: "Staff & CRM", price: "$29/mo" }
                   ].map((module, i) => (
                     <div key={i} className="flex items-center justify-between pb-3.5 border-b border-white/5 last:border-0 last:pb-0 text-sm sm:text-base">
                       <span className="text-gray-300 font-medium">{module.name}</span>
                       <span className="text-[#DFB776] font-bold">{module.price}</span>
                     </div>
                   ))}
                 </div>
                 
                 <Link href="/signup" className="block w-full py-4 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] text-[#070F1E] rounded-xl font-bold text-center transition-all shadow-[0_0_20px_rgba(202,152,81,0.35)] text-sm sm:text-base">
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
          className="max-w-7xl mx-auto mt-24 sm:mt-32 border-t border-white/5 pt-20 sm:pt-32 mb-16 px-1 sm:px-4"
        >
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CA9851]/10 border border-[#CA9851]/30 text-xs font-semibold text-[#DFB776] mb-6 sm:mb-8 backdrop-blur-md">
                <Users size={14} className="text-[#CA9851]" />
                <span>Here for you</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Support & Sales.</h2>
              <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 leading-relaxed max-w-md">
                Have questions about custom implementations, data migration, enterprise pricing, or need technical help? Our team is ready to help you architect the perfect solution.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#CA9851]/10 border border-[#CA9851]/20 rounded-xl flex items-center justify-center text-[#DFB776] flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1 text-base sm:text-lg">Email Us</h3>
                    <a href="mailto:support@yarvohotel.com" className="text-gray-400 hover:text-[#DFB776] transition-colors text-sm sm:text-base break-all" aria-label="Email Support">
                      support [at] yarvohotel.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#CA9851]/10 border border-[#CA9851]/20 rounded-xl flex items-center justify-center text-[#DFB776] flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1 text-base sm:text-lg">Call Us</h3>
                    <p className="text-gray-400 text-sm sm:text-base">+1 (800) 555-0199</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#070F1E] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
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

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-gray-300">First Name</label>
                     <input required value={contactForm.firstName} onChange={e => setContactForm({...contactForm, firstName: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] transition-colors text-sm" placeholder="John" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-gray-300">Last Name</label>
                     <input required value={contactForm.lastName} onChange={e => setContactForm({...contactForm, lastName: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] transition-colors text-sm" placeholder="Doe" />
                   </div>
                 </div>
                 
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-300">Work Email</label>
                   <input required value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] transition-colors text-sm" placeholder="name@company.com" />
                 </div>
                 
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-300">Property Name</label>
                   <input required value={contactForm.propertyName} onChange={e => setContactForm({...contactForm, propertyName: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] transition-colors text-sm" placeholder="The Grand Hotel" />
                 </div>
                 
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-300">Message</label>
                   <textarea required value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] transition-colors resize-none text-sm" placeholder="Tell us about your requirements..."></textarea>
                 </div>
                 
                 <button disabled={contactStatus === 'loading'} type="submit" className="w-full py-4 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] disabled:opacity-50 text-[#070F1E] rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(202,152,81,0.3)] mt-2 text-sm sm:text-base">
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
          className="max-w-5xl mx-auto mt-16 mb-20 sm:mb-24 relative px-1 sm:px-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#CA9851] to-[#0B1D33] blur-[120px] opacity-20 pointer-events-none" />
          <div className="relative bg-[#070F1E] border border-[#CA9851]/25 rounded-2xl sm:rounded-[3rem] p-8 sm:p-14 md:p-24 text-center overflow-hidden shadow-2xl">
            {/* Inner glow accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#CA9851] to-transparent opacity-60" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#DFB776] to-transparent opacity-30" />
            
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight relative z-10">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E9C78C] via-[#CA9851] to-[#B3823E]">upgrade?</span>
            </h2>
            <p className="text-sm sm:text-xl text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed relative z-10">
              Join forward-thinking properties today and experience the most advanced, modular property management OS ever built.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10 max-w-sm sm:max-w-none mx-auto">
              <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] text-[#070F1E] rounded-full font-bold hover:scale-105 active:scale-95 transition-all text-sm sm:text-lg shadow-[0_0_40px_rgba(202,152,81,0.35)]">
                Create Your Account <ArrowRight size={20} />
              </Link>
              <Link href="#contact" className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-[#0B1D33]/40 text-white border border-[#CA9851]/30 hover:border-[#CA9851]/70 rounded-full font-bold hover:bg-[#0B1D33]/70 transition-all text-sm sm:text-lg flex justify-center items-center">
                Talk to Sales
              </Link>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8 relative z-10">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>
        </motion.section>

      </div>

      {/* Footer */}
      <footer className="border-t border-[#CA9851]/15 py-12 relative z-10 bg-[#050B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="/yarvo-logo-dark-horizontal.png" 
              alt="Yarvo Hotel - Smarter Hotel Management" 
              width={160}
              height={38}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = "/yarvo-logo-dark.jpg";
              }}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
            <Link href="#features-path" className="hover:text-[#DFB776] transition-colors">Features</Link>
            <Link href="#interactive-preview" className="hover:text-[#DFB776] transition-colors">Preview</Link>
            <Link href="#platform" className="hover:text-[#DFB776] transition-colors">Platform</Link>
            <Link href="#pricing" className="hover:text-[#DFB776] transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-[#DFB776] transition-colors">FAQ</Link>
            <Link href="#contact" className="hover:text-[#DFB776] transition-colors">Support & Sales</Link>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <a href="https://twitter.com/yarvohotel" target="_blank" rel="noopener noreferrer" className="hover:text-[#DFB776] transition-colors" aria-label="Yarvo Hotel on X (Twitter)">X / Twitter</a>
            <a href="https://linkedin.com/company/yarvohotel" target="_blank" rel="noopener noreferrer" className="hover:text-[#DFB776] transition-colors" aria-label="Yarvo Hotel on LinkedIn">LinkedIn</a>
            <a href="https://facebook.com/yarvohotel" target="_blank" rel="noopener noreferrer" className="hover:text-[#DFB776] transition-colors" aria-label="Yarvo Hotel on Facebook">Facebook</a>
            <a href="https://instagram.com/yarvohotel" target="_blank" rel="noopener noreferrer" className="hover:text-[#DFB776] transition-colors" aria-label="Yarvo Hotel on Instagram">Instagram</a>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 text-center md:text-right">
            &copy; {new Date().getFullYear()} Yarvo Hotel. Smarter Hotel Management. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
