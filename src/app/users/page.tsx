'use client';

import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Ban,
  Mail,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Loader2,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cn } from '@/lib/utils';
import { useListQuery } from '@/lib/hooks';
import { UserType } from '@/schema';
import { useRouter, useSearchParams } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const {
    data: users,
    loading,
    current,
    total,
    totalPages,
    hasNextPage,
    fetchData,
  } = useListQuery<UserType>({
    uri: '/v1/users',
    params: { page, limit: 12 },
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', value);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Users' }]} />

      <main className="flex-1 p-8 pt-[100px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#EAEAEA]">
              User Management
            </h2>
            <p className="text-sm text-[#8c8c8c] mt-1">
              Manage and monitor platform participants.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#EAEAEA] rounded-[10px] text-sm font-bold text-[#141414] hover:bg-white transition-colors">
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8c8c]" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full h-11 bg-[#1a1a1a] border border-[#242424] rounded-[12px] pl-10 pr-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 h-11 px-4 bg-[#1a1a1a] border border-[#242424] rounded-[12px] text-sm font-semibold text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] overflow-hidden min-h-[400px] flex flex-col">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#242424]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 text-[#EAEAEA] animate-spin" />
                        <p className="text-sm text-[#8c8c8c]">
                          Loading users...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <p className="text-sm text-[#8c8c8c]">No users found</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#202020] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profile_image ? (
                            <img
                              src={user.profile_image}
                              alt={user.display_name}
                              className="h-10 w-10 rounded-full object-cover bg-[#242424]"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[#242424] flex items-center justify-center text-[#8c8c8c] font-bold">
                              {user.display_name.charAt(0)}
                            </div>
                          )}
                          <div
                            onClick={() => router.push(`/users/${user.id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <p className="text-sm font-bold text-[#EAEAEA]">
                              {user.display_name}
                            </p>
                            <p className="text-xs text-[#8c8c8c]">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider',
                            user.role === 'admin' &&
                              'bg-emerald-500/10 text-emerald-500',
                            user.role === 'creator' &&
                              'bg-blue-500/10 text-blue-500',
                            user.role === 'user' &&
                              'bg-[#242424] text-[#8c8c8c]',
                          )}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#EAEAEA]">
                        Lvl {user.level}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-[#292929] rounded-lg text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
                            <Mail className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-[#292929] rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                            <Ban className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-[#292929] rounded-lg text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && users.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#242424] bg-[#1a1a1a]">
              <p className="text-xs text-[#8c8c8c]">
                Showing {(current - 1) * 12 + 1} to{' '}
                {Math.min(current * 12, total)} of {total} users
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={current === 1}
                  onClick={() => handlePageChange(current - 1)}
                  className="p-1 text-[#8c8c8c] hover:text-[#EAEAEA] disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  if (totalPages > 5) {
                    if (p > 5 && p < totalPages) return null;
                    if (p === 5 && totalPages > 6)
                      return (
                        <span key="dots" className="text-[#8c8c8c]">
                          ...
                        </span>
                      );
                  }

                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={cn(
                        'px-2 py-1 text-xs font-bold rounded-md transition-colors',
                        current === p
                          ? 'bg-[#EAEAEA] text-[#141414]'
                          : 'text-[#8c8c8c] hover:text-[#EAEAEA]',
                      )}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  disabled={!hasNextPage}
                  onClick={() => handlePageChange(current + 1)}
                  className="p-1 text-[#8c8c8c] hover:text-[#EAEAEA] disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
