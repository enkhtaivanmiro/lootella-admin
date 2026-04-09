'use client';

import {
  Box,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Tag,
  Eye,
  Edit,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cn } from '@/lib/utils';
import { useQuery } from '@/lib/hooks';
import { CasesAllResponseType, CaseType } from '@/schema';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function CasesPage() {
  const [q, setQ] = useState('');
  const { data: rawCases, loading } = useQuery<CasesAllResponseType>({
    uri: '/v1/cases/all',
    enabled: true,
  });

  const allCases = useMemo(() => {
    if (!rawCases) return [];

    return Object.entries(rawCases).flatMap(([category, cases]) =>
      cases.map((c) => ({
        ...c,
        category,
      })),
    );
  }, [rawCases]);

  const filteredCases = useMemo(() => {
    return allCases.filter(
      (c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.category.toLowerCase().includes(q.toLowerCase()),
    );
  }, [allCases, q]);

  const activeCasesCount = allCases.filter((c) => c.isActive).length;

  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cases' }]} />

      <main className="flex-1 p-8 pt-[100px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#EAEAEA]">
              Case Management
            </h2>
            <p className="text-sm text-[#8c8c8c] mt-1">
              Configure drop rates and case visibility.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#EAEAEA] rounded-[10px] text-sm font-bold text-[#141414] hover:bg-white transition-colors">
            <Plus className="h-4 w-4" />
            Create Case
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">
              Total Active Cases
            </p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">
              {loading ? '...' : activeCasesCount}
            </h4>
          </div>
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">
              Total Categories
            </p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">
              {loading ? '...' : Object.keys(rawCases || {}).length}
            </h4>
          </div>
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">
              Total Case Models
            </p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">
              {loading ? '...' : allCases.length}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8c8c]" />
            <input
              type="text"
              placeholder="Filter cases by name or category..."
              className="w-full h-11 bg-[#1a1a1a] border border-[#242424] rounded-[12px] pl-10 pr-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="h-11 px-4 bg-[#1a1a1a] border border-[#242424] rounded-[12px] text-sm font-semibold text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
              Premium
            </button>
            <button className="h-11 px-4 bg-[#1a1a1a] border border-[#242424] rounded-[12px] text-sm font-semibold text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
              Active
            </button>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] overflow-hidden min-h-[400px] flex flex-col">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#242424]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Case Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Price / Mode
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 text-[#EAEAEA] animate-spin" />
                        <p className="text-sm text-[#8c8c8c]">
                          Loading cases...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <p className="text-sm text-[#8c8c8c]">No cases found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-[#202020] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="h-12 w-12 rounded-lg bg-[#242424] border border-[#3E3E3E] flex items-center justify-center p-1">
                          {c.image ? (
                            <img
                              src={c.image}
                              alt={c.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Box className="h-6 w-6 text-[#8c8c8c]" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#EAEAEA]">
                        {c.name}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#EAEAEA]">
                          {c.price.amount === 0
                            ? 'FREE'
                            : `${c.price.amount} ${c.price.currency.toUpperCase()}`}
                        </p>
                        <p className="text-xs text-[#8c8c8c] uppercase font-bold tracking-tight">
                          {c.defaultMode}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider',
                            c.isActive
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-[#8c8c8c]/10 text-[#8c8c8c]',
                          )}
                        >
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                          <Package className="h-3 w-3" />
                          {c.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/cases/${c.slug}`}>
                            <button className="p-2 hover:bg-[#292929] rounded-lg text-[#8c8c8c] hover:text-[#EAEAEA]">
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          <button className="p-2 hover:bg-[#292929] rounded-lg text-[#8c8c8c] hover:text-[#EAEAEA]">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-[#292929] rounded-lg text-[#8c8c8c] hover:text-[#EAEAEA]">
                            <Copy className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-[#292929] rounded-lg text-[#E96262]">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredCases.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#242424] bg-[#1a1a1a]">
              <p className="text-xs text-[#8c8c8c]">
                Showing {filteredCases.length} of {allCases.length} cases
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="p-1 text-[#8c8c8c] disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="px-2 py-1 text-xs font-bold bg-[#EAEAEA] text-[#141414] rounded-md">
                  1
                </button>
                <button
                  disabled
                  className="p-1 text-[#8c8c8c] disabled:opacity-30"
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
