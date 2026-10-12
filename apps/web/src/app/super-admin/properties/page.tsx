'use client';

import { useEffect, useState } from 'react';
import { Building2, CheckCircle2, XCircle, Search, MoreVertical, ShieldAlert } from 'lucide-react';

export default function PropertiesAdminPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: 'APPROVE' | 'DENY'; propertyId: string; propertyName: string }>({
    isOpen: false,
    type: 'APPROVE',
    propertyId: '',
    propertyName: ''
  });

  const [viewModal, setViewModal] = useState<{ isOpen: boolean; property: any }>({
    isOpen: false,
    property: null
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/super-admin/properties`, {
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(json => {
      const data = json.data || json;
      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        setProperties([]);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setProperties([]);
      setLoading(false);
    });
  };

  const executeAction = async () => {
    try {
      const status = actionModal.type === 'APPROVE' ? 'APPROVED' : 'SUSPENDED';
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/super-admin/properties/${actionModal.propertyId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      setActionModal({ ...actionModal, isOpen: false });
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Properties</h2>
          <p className="text-gray-400">Manage all businesses operating on Yarvo OS.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search properties..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 bg-[#0A0A0A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Users</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading properties...</td>
                </tr>
              ) : filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No properties found.</td>
                </tr>
              ) : (
                filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.email || 'No email provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {p.city}, {p.country}
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                          <CheckCircle2 size={14} /> Active
                        </span>
                      )}
                      {p.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                          <ShieldAlert size={14} /> Pending
                        </span>
                      )}
                      {p.status === 'SUSPENDED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                          <XCircle size={14} /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {p._count?.users || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setViewModal({ isOpen: true, property: p })}
                          className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 size={14} className="hidden" /> View
                        </button>

                        {p.status !== 'APPROVED' && (
                          <button 
                            onClick={() => setActionModal({ isOpen: true, type: 'APPROVE', propertyId: p.id, propertyName: p.name })}
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            Approve
                          </button>
                        )}
                        
                        {p.status !== 'SUSPENDED' && (
                          <button 
                            onClick={() => setActionModal({ isOpen: true, type: 'DENY', propertyId: p.id, propertyName: p.name })}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            Deny
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className={`h-1.5 w-full ${actionModal.type === 'APPROVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${actionModal.type === 'APPROVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {actionModal.type === 'APPROVE' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {actionModal.type === 'APPROVE' ? 'Approve Property' : 'Deny Property'}
                  </h3>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                Are you sure you want to {actionModal.type === 'APPROVE' ? 'approve' : 'deny'} <strong className="text-white">{actionModal.propertyName}</strong>? 
                {actionModal.type === 'APPROVE' 
                  ? ' They will gain full access to the Yarvo OS platform immediately.'
                  : ' Their access will be suspended and they will not be able to log into the platform.'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setActionModal({ ...actionModal, isOpen: false })}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAction}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors text-black ${actionModal.type === 'APPROVE' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  Yes, {actionModal.type === 'APPROVE' ? 'Approve' : 'Deny'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Property Modal */}
      {viewModal.isOpen && viewModal.property && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Building2 className="text-blue-400" />
                Property Details
              </h3>
              <button 
                onClick={() => setViewModal({ isOpen: false, property: null })}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Business Name</div>
                <div className="text-lg text-white font-medium">{viewModal.property.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</div>
                  <div className="text-gray-300">{viewModal.property.city}, {viewModal.property.country}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                  <div className="text-gray-300">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      viewModal.property.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      viewModal.property.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {viewModal.property.status}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Address</div>
                <div className="text-gray-300">{viewModal.property.address || 'N/A'}</div>
              </div>
              {viewModal.property.selectedFeatures && viewModal.property.selectedFeatures.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Requested Features</div>
                  <div className="flex flex-wrap gap-2">
                    {viewModal.property.selectedFeatures.map((f: string) => (
                      <span key={f} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
