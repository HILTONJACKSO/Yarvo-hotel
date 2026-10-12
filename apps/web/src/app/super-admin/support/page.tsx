'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Mail, Globe, Briefcase, Building2 } from 'lucide-react';

export default function SupportAdminPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/super-admin/support-tickets`, {
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(json => {
      const data = json.data || json;
      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        setTickets([]);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setTickets([]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Support & Sales Leads</h2>
        <p className="text-gray-400">View incoming sales requests and support tickets.</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center text-gray-500 py-12 bg-[#0A0A0A] border border-white/5 rounded-2xl">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-[#0A0A0A] border border-white/5 rounded-2xl">No tickets found.</div>
        ) : (
          tickets.map(ticket => (
            <div key={ticket.id} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{ticket.subject}</h3>
                    <div className="text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {ticket.message}
                </div>
              </div>

              <div className="w-full md:w-64 space-y-3 bg-white/[0.02] rounded-xl p-4 border border-white/5 h-fit">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Info</h4>
                {ticket.name && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-gray-400"><Briefcase size={12} /></div>
                    {ticket.name}
                  </div>
                )}
                {ticket.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-gray-400"><Mail size={12} /></div>
                    <a href={`mailto:${ticket.email}`} className="hover:text-blue-400 transition-colors">{ticket.email}</a>
                  </div>
                )}
                {ticket.businessType && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-gray-400"><Building2 size={12} /></div>
                    {ticket.businessType}
                  </div>
                )}
                {ticket.country && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-gray-400"><Globe size={12} /></div>
                    {ticket.country}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
