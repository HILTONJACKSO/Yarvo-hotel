'use client';

import { useEffect, useState } from 'react';
import { Search, Building2, KeyRound } from 'lucide-react';

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/super-admin/users`, {
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(json => {
      const data = json.data || json;
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;
    setResetLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/super-admin/users/${selectedUser.id}/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
        credentials: 'include'
      });
      if (res.ok) {
        alert('Password reset successfully!');
        setIsResetModalOpen(false);
        setNewPassword('');
      } else {
        alert('Failed to reset password');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setResetLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.firstName?.toLowerCase().includes(search.toLowerCase()) || 
                          u.lastName?.toLowerCase().includes(search.toLowerCase()) || 
                          u.email?.toLowerCase().includes(search.toLowerCase());
    
    let matchesStatus = true;
    if (userFilter === 'ACTIVE') {
      matchesStatus = u.isActive === true && !u.isLocked;
    } else if (userFilter === 'INACTIVE') {
      matchesStatus = u.isActive === false || u.isLocked === true;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Users Management</h2>
          <p className="text-gray-400">Manage all registered users, permissions, and passwords.</p>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#050505]">
          <div className="flex bg-white/5 p-1 rounded-xl w-max">
            {['ALL', 'ACTIVE', 'INACTIVE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setUserFilter(tab as any)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  userFilter === tab 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'ALL' ? 'All Users' : tab === 'ACTIVE' ? 'Active' : 'Inactive'}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050505] text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg uppercase">
                          {u.firstName?.charAt(0) || 'U'}{u.lastName?.charAt(0) || ''}
                        </div>
                        <div>
                          <div className="text-white font-medium">{u.firstName} {u.lastName}</div>
                          <div className="text-gray-500 text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.roles?.map((r: any) => (
                          <span key={r.name} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {u.property ? (
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-gray-500" />
                          {u.property.name}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedUser(u);
                          setIsResetModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-bold transition-colors"
                      >
                        <KeyRound size={14} /> Reset Password
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Reset Modal */}
      {isResetModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Reset Password</h3>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to forcibly reset the password for <strong className="text-white">{selectedUser.email}</strong>?
              </p>
              
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter new strong password"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetModalOpen(false);
                      setNewPassword('');
                    }}
                    className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    {resetLoading ? 'Resetting...' : 'Confirm Reset'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
