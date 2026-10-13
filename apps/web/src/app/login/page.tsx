'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, BarChart3, ShieldCheck, Hotel, ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      // Handle both transformed { data: { user: ... } } and direct { user: ... }
      const user = data?.data?.user || data?.user;
      const roles: string[] = Array.isArray(user?.roles)
        ? user.roles.map((r: any) => typeof r === 'string' ? r.toUpperCase() : (r?.name?.toUpperCase() || ''))
        : [];
      const isSuperAdmin = roles.includes('SUPER_ADMIN');

      const searchParams = new URLSearchParams(window.location.search);
      const nextUrl = searchParams.get('next');

      if (isSuperAdmin) {
        window.location.href = '/super-admin';
      } else if (nextUrl && !nextUrl.startsWith('/login') && !nextUrl.startsWith('/super-admin')) {
        window.location.href = nextUrl;
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#050B14] text-gray-200 font-sans selection:bg-[#CA9851]/30 overflow-hidden flex flex-col justify-center items-center relative p-4 sm:p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#0B1D33]/60 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#CA9851]/12 blur-[140px]" />
      </div>

      <Link href="/" className="absolute top-6 left-6 z-50 text-gray-400 hover:text-[#DFB776] flex items-center gap-2 transition-colors text-sm font-medium">
        <ArrowLeft size={18} /> Back to Home
      </Link>

      <div className="relative z-10 w-full max-w-5xl my-auto">
        <div className="w-full flex flex-col md:flex-row bg-[#070F1E] border border-[#CA9851]/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
          
          {/* Left Panel - Branding */}
          <div className="hidden md:flex flex-col justify-between w-1/2 p-10 xl:p-14 bg-gradient-to-br from-[#0B1D33]/50 to-transparent border-r border-[#CA9851]/15 relative">
            <div className="absolute inset-0 bg-[#CA9851]/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
               <div className="mb-10">
                 <Link href="/" className="inline-block group">
                   <img 
                     src="/yarvo-logo-dark-horizontal.png" 
                     alt="Yarvo Hotel - Smarter Hotel Management" 
                     onError={(e) => {
                       e.currentTarget.src = "/yarvo-logo-dark.jpg";
                     }}
                     className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
                   />
                 </Link>
               </div>
               
               <h1 className="text-3xl xl:text-4xl font-extrabold text-white mb-4 leading-tight">
                 Welcome back to<br />the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E9C78C] via-[#CA9851] to-[#B3823E]">Operating System</span>.
               </h1>
               <p className="text-gray-400 text-sm mb-10 max-w-sm leading-relaxed">
                 Sign in to access your modules, view live reservations, and manage your property.
               </p>

               <div className="space-y-5">
                 {[
                   { icon: Building2, title: "Modular Architecture", desc: "Access only the features you need" },
                   { icon: BarChart3, title: "Real-Time Syncing", desc: "Zero latency between PMS and POS" },
                   { icon: ShieldCheck, title: "Data Isolation", desc: "Enterprise-grade multi-tenancy" }
                 ].map((feature, i) => (
                   <div key={i} className="flex items-start gap-3.5">
                     <div className="w-9 h-9 rounded-xl bg-[#CA9851]/10 border border-[#CA9851]/25 flex items-center justify-center text-[#DFB776] flex-shrink-0">
                       <feature.icon size={18} />
                     </div>
                     <div>
                       <h3 className="text-white text-sm font-semibold">{feature.title}</h3>
                       <p className="text-xs text-gray-400">{feature.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="relative z-10 text-xs text-gray-500 mt-10">
              &copy; {new Date().getFullYear()} Yarvo Hotel. Smarter Hotel Management.
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 xl:p-16 flex flex-col justify-center bg-[#070F1E]">
            {/* Mobile Logo Header */}
            <div className="md:hidden mb-8 text-center">
              <Link href="/" className="inline-block">
                <img 
                  src="/yarvo-logo-dark-horizontal.png" 
                  alt="Yarvo Hotel" 
                  onError={(e) => {
                    e.currentTarget.src = "/yarvo-logo-dark.jpg";
                  }}
                  className="h-9 w-auto mx-auto object-contain"
                />
              </Link>
            </div>

            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-white mb-2">Sign In</h2>
              <p className="text-gray-400 text-sm">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-pulse">
                  <ShieldCheck size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#050B14] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] focus:ring-1 focus:ring-[#CA9851] transition-all text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <Link href="#" className="text-xs font-semibold text-[#DFB776] hover:text-[#E9C78C] transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#050B14] border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CA9851] focus:ring-1 focus:ring-[#CA9851] transition-all text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#DFB776] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#DFB776] via-[#CA9851] to-[#B3823E] hover:from-[#E9C78C] hover:to-[#DFB776] text-[#070F1E] rounded-xl font-bold transition-all shadow-[0_0_25px_rgba(202,152,81,0.35)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-[#070F1E]" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In to Yarvo"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400 border-t border-white/10 pt-6">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#DFB776] hover:text-[#E9C78C] font-bold transition-colors">
                Create a new property
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
