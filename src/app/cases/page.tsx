'use client';

import {
  Box,
  Search,
  Eye,
  Edit,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Package,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cn } from '@/lib/utils';
import { useListQuery } from '@/lib/hooks';
import { CaseType, CaseCategory } from '@/schema';
import { useState, useMemo, Fragment } from 'react';
import Link from 'next/link';
import { CreateCaseDialog } from '@/components/CreateCaseDialog';

export default function CasesPage() {
  const [q, setQ] = useState('');
  const { data, loading, fetchData, current, totalPages, total } =
    useListQuery<CaseType>({
      uri: '/v1/cases/admin/all',
      enabled: true,
      params: { page: 1, limit: 20 },
    });

  const [category, setCategory] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const groupedData = useMemo(() => {
    const map = new Map<string, { master?: CaseType; variants: CaseType[] }>();
    const roots: string[] = [];

    data.forEach((item) => {
      const gId = item.primaryContainerId || item.id;
      if (!map.has(gId)) {
        map.set(gId, { variants: [] });
        roots.push(gId);
      }

      const group = map.get(gId)!;
      if (item.id === gId) {
        group.master = item;
      } else {
        group.variants.push(item);
      }
    });

    return roots
      .map((id) => {
        const group = map.get(id)!;
        if (!group.master && group.variants.length > 0) {
          return {
            master: group.variants[0],
            variants: group.variants.slice(1),
          };
        }
        return { master: group.master!, variants: group.variants };
      })
      .filter((g) => !!g.master);
  }, [data]);

  const handleSearch = (val: string) => {
    setQ(val);
    fetchData({ search: val, category, page: 1 });
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    fetchData({ page: 1 });
  };

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
          <CreateCaseDialog onSuccess={fetchData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">
              Total Active Cases
            </p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">
              {loading ? '...' : total}
            </h4>
          </div>
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">
              Total Categories
            </p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">
              {loading ? '...' : total > 0 ? 'Active' : '0'}
            </h4>
          </div>
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">
              Total Case Models
            </p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">
              {loading ? '...' : total}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 text-[#EAEAEA]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8c8c]" />
            <input
              type="text"
              placeholder="Search cases by name..."
              className="w-full h-11 bg-[#1a1a1a] border border-[#242424] rounded-[12px] pl-10 pr-4 text-sm focus:outline-none focus:border-[#3E3E3E] transition-colors"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-11 px-4 bg-[#1a1a1a] border border-[#242424] rounded-[12px] text-sm font-semibold text-[#8c8c8c] focus:outline-none focus:border-[#3E3E3E] transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {Object.values(CaseCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            <button className="h-11 px-4 bg-[#1a1a1a] border border-[#242424] rounded-[12px] text-sm font-semibold text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
              Premium
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
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <p className="text-sm text-[#8c8c8c]">No cases found</p>
                    </td>
                  </tr>
                ) : (
                  groupedData.map(({ master, variants }) => {
                    const isExpanded = expandedGroups.has(master.id);
                    const hasVariants = variants.length > 0;

                    return (
                      <Fragment key={master.id}>
                        <tr className="hover:bg-[#202020] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {hasVariants && (
                                <button
                                  onClick={() => toggleGroup(master.id)}
                                  className="p-1 hover:bg-[#292929] rounded transition-colors text-[#8c8c8c]"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                              <div className="h-12 w-12 rounded-lg bg-[#242424] border border-[#3E3E3E] flex items-center justify-center p-1">
                                {master.image ? (
                                  <img
                                    src={master.image}
                                    alt={master.name}
                                    className="h-full w-full object-contain"
                                  />
                                ) : (
                                  <Box className="h-6 w-6 text-[#8c8c8c]" />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-[#EAEAEA]">
                                {master.name}
                              </span>
                              {hasVariants && (
                                <span className="text-[10px] text-[#8c8c8c] font-bold uppercase tracking-wider">
                                  {variants.length} Variants
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-[#EAEAEA]">
                              {master.price.amount === 0
                                ? 'FREE'
                                : `${master.price.amount} ${master.price.currency.toUpperCase()}`}
                            </p>
                            <p className="text-xs text-[#8c8c8c] uppercase font-bold tracking-tight">
                              {master.defaultMode}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                'text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider',
                                master.isActive
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : 'bg-[#8c8c8c]/10 text-[#8c8c8c]',
                              )}
                            >
                              {master.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                              <Package className="h-3 w-3" />
                              {master.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link href={`/cases/${master.slug}`}>
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

                        {isExpanded &&
                          variants.map((v) => (
                            <tr
                              key={v.id}
                              className="bg-[#1e1e1e]/50 hover:bg-[#242424] transition-colors group"
                            >
                              <td className="px-6 py-3 pl-16">
                                <div className="h-10 w-10 rounded-lg bg-[#242424] border border-[#3E3E3E] flex items-center justify-center p-1">
                                  {v.image ? (
                                    <img
                                      src={v.image}
                                      alt={v.name}
                                      className="h-full w-full object-contain"
                                    />
                                  ) : (
                                    <Box className="h-5 w-5 text-[#8c8c8c]" />
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-[#3E3E3E]" />
                                  <span className="text-sm font-medium text-[#c0c0c0]">
                                    {v.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-3">
                                <p className="text-xs font-bold text-[#EAEAEA]">
                                  {v.price.amount === 0
                                    ? 'FREE'
                                    : `${v.price.amount} ${v.price.currency.toUpperCase()}`}
                                </p>
                                <p className="text-[10px] text-[#8c8c8c] uppercase font-bold">
                                  {v.defaultMode}
                                </p>
                              </td>
                              <td className="px-6 py-3">
                                <span
                                  className={cn(
                                    'text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                                    v.isActive
                                      ? 'bg-emerald-500/10 text-emerald-500'
                                      : 'bg-[#8c8c8c]/10 text-[#8c8c8c]',
                                  )}
                                >
                                  {v.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-3">
                                <span className="text-[10px] font-bold text-[#8c8c8c] uppercase">
                                  {v.category}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Link href={`/cases/${v.slug}`}>
                                    <button className="p-1.5 hover:bg-[#292929] rounded text-[#8c8c8c] hover:text-[#EAEAEA]">
                                      <Eye className="h-3.5 w-3.5" />
                                    </button>
                                  </Link>
                                  <button className="p-1.5 hover:bg-[#292929] rounded text-[#8c8c8c] hover:text-[#EAEAEA]">
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>
                                  <button className="p-1.5 hover:bg-[#292929] rounded text-[#E96262]">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && data.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#242424] bg-[#1a1a1a]">
              <p className="text-xs text-[#8c8c8c]">
                Showing {data.length} of {total} cases
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={current === 1}
                  onClick={() =>
                    fetchData({
                      page: current - 1,
                      limit: 10,
                    })
                  }
                  className="p-1 text-[#8c8c8c] disabled:opacity-30 hover:text-[#EAEAEA] transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-1 mx-2">
                  <span className="text-xs font-bold text-[#EAEAEA] px-2 py-1 bg-[#242424] rounded-md border border-[#3E3E3E]">
                    {current}
                  </span>
                  <span className="text-xs text-[#8c8c8c]">/</span>
                  <span className="text-xs font-bold text-[#8c8c8c] px-1">
                    {totalPages}
                  </span>
                </div>
                <button
                  disabled={current === totalPages}
                  onClick={() =>
                    fetchData({
                      page: current + 1,
                      limit: 10,
                    })
                  }
                  className="p-1 text-[#8c8c8c] disabled:opacity-30 hover:text-[#EAEAEA] transition-colors"
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
