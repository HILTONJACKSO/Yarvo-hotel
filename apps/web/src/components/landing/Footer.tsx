
"use client";
import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#1F1F1F] text-white pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-white/20 pb-16 mb-12">
        <div className="md:col-span-1">
          <h3 className="font-serif text-2xl tracking-widest uppercase mb-8">Yarvo<br/>Hotel<br/>OS</h3>
          <p className="text-sm opacity-60 font-light leading-relaxed">
            A modern cloud and offline-first property management system for hotels, resorts, and hospitality businesses.
          </p>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] mb-8 text-[#FAF9F4]/70">Navigation</h4>
          <ul className="space-y-4 text-sm font-light opacity-80">
            <li><Link href="/" className="hover:text-[#F5A623] transition-colors">Home</Link></li>
            <li><Link href="/#features-path" className="hover:text-[#F5A623] transition-colors">Features</Link></li>
            <li><Link href="/#pricing" className="hover:text-[#F5A623] transition-colors">Pricing</Link></li>
            <li><Link href="/#faq" className="hover:text-[#F5A623] transition-colors">FAQ</Link></li>
            <li><Link href="/#contact" className="hover:text-[#F5A623] transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] mb-8 text-[#FAF9F4]/70">Contact</h4>
          <ul className="space-y-4 text-sm font-light opacity-80">
            <li className="flex items-center gap-3"><Mail size={16} /> support@yarvohotel.com</li>
            <li className="flex items-start gap-3"><MapPin size={16} className="mt-1 flex-shrink-0" /> Monrovia, Liberia</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] mb-8 text-[#FAF9F4]/70">Get Started</h4>
          <p className="text-sm opacity-60 font-light mb-6">Start your 14-day free trial today.</p>
          <Link href="/signup" className="inline-block px-5 py-2.5 bg-[#DFB776] text-[#070F1E] font-bold text-xs uppercase tracking-widest rounded-full">
            Start Free
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs opacity-40 font-light uppercase tracking-widest">
        <p>© {new Date().getFullYear()} Yarvo Hotel OS. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/login" className="hover:text-[#F5A623] transition-colors">Staff Login</Link>
          <a href="#" className="hover:text-[#F5A623] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#F5A623] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// 3. MAIN PAGE
// ==========================================


export { Footer };
