'use client';

import { useEffect, useState } from 'react';
import { Building2, Users, DollarSign, Activity } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/super-admin/stats`, {
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(json => {
      setStats(json.data || json);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setStats(null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-gray-500 animate-pulse">Loading dashboard...</div>;
  }

  const cards = [
    { name: 'Total Properties', value: stats?.totalProperties || 0, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { name: 'Pending Approvals', value: stats?.pendingProperties || 0, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { name: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { name: 'Est. Monthly Revenue', value: `$${stats?.mrr?.toLocaleString() || 0}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Overview</h2>
        <p className="text-gray-400">Welcome to the Yarvo OS Super Admin control center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} blur-[60px] rounded-full pointer-events-none`} />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-medium text-gray-400">{card.name}</h3>
              <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.border} border flex items-center justify-center ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
            <div className="text-4xl font-bold text-white relative z-10">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/super-admin/properties'}
            className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm font-medium text-white"
          >
            <Activity size={18} className="text-amber-400" />
            Review Pending Properties
          </button>
          <button 
            onClick={() => window.location.href = '/super-admin/users'}
            className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm font-medium text-white"
          >
            <Users size={18} className="text-indigo-400" />
            Manage Users
          </button>
          <button 
            onClick={() => window.location.href = '/super-admin/support'}
            className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm font-medium text-white"
          >
            <DollarSign size={18} className="text-emerald-400" />
            View Support & Sales
          </button>
        </div>
      </div>

      {/* Data Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Card */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-80">
          <h3 className="text-lg font-bold text-white mb-6">Platform Growth (This Year)</h3>
          <div className="flex-1 flex items-end justify-between gap-2">
            {(stats?.platformGrowth || new Array(12).fill(0)).map((val: number, i: number) => {
              const maxVal = Math.max(...(stats?.platformGrowth || [1]), 10); // Minimum scale of 10
              return (
                <div key={i} className="w-full bg-blue-500/20 rounded-t-sm relative group transition-all duration-300 hover:bg-blue-500/40" style={{ height: `${(val / maxVal) * 100}%`, minHeight: val === 0 ? '4px' : undefined }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-80">
          <h3 className="text-lg font-bold text-white mb-6">Recent System Activity</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity: any, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-white/20" />
                  <div>
                    <div className={`text-sm font-medium ${activity.color}`}>{activity.text}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm italic">No recent activity found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
