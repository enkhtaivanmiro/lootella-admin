'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Calendar,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cn } from '@/lib/utils';
import { useListQuery } from '@/lib/hooks';
import { PaymentType, PaymentStatus, PaymentMethod } from '@/schema';
import dayjs from 'dayjs';

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<PaymentStatus | 'ALL'>('ALL');
  const [searchId, setSearchId] = useState('');

  const queryParams = useMemo(() => {
    const params: Record<string, any> = { page: 1, limit: 12 };
    if (activeTab !== 'ALL') {
      params.status = activeTab;
    }
    if (searchId) {
      params.userId = searchId;
    }
    return params;
  }, [activeTab, searchId]);

  const {
    data: invoices,
    loading,
    current,
    totalPages,
    total,
    fetchData,
  } = useListQuery<PaymentType>({
    uri: '/v1/payment',
    params: queryParams,
  });

  const handlePageChange = (newPage: number) => {
    fetchData({ ...queryParams, page: newPage });
  };

  const tabs = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: PaymentStatus.PENDING },
    { label: 'Success', value: PaymentStatus.SUCCESS },
    { label: 'Expired', value: PaymentStatus.EXPIRED },
    { label: 'Rejected', value: PaymentStatus.REJECTED },
  ];

  const getStatusStyles = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return 'bg-emerald-500/10 text-emerald-500';
      case PaymentStatus.PENDING:
        return 'bg-amber-500/10 text-amber-500';
      case PaymentStatus.EXPIRED:
        return 'bg-gray-500/10 text-gray-500';
      case PaymentStatus.REJECTED:
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-[#242424] text-[#8c8c8c]';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Transactions' }]}
      />

      <main className="flex-1 p-8 pt-[100px] max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#EAEAEA] tracking-tight">
              Transaction Logs
            </h2>
            <p className="text-sm font-medium text-[#8c8c8c] mt-1">
              Monitor all financial movements on the platform.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] border border-[#242424] rounded-[14px] text-sm font-bold text-[#8c8c8c] hover:text-[#EAEAEA] hover:border-white/10 transition-all shadow-xl">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex h-12 bg-[#141414] border border-[#242424] rounded-[16px] p-1.5 shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={cn(
                  'px-6 h-full rounded-[12px] text-sm font-bold transition-all relative',
                  activeTab === tab.value
                    ? 'bg-[#242424] text-[#EAEAEA] shadow-lg border border-white/5'
                    : 'text-[#8c8c8c] hover:text-[#EAEAEA]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8c8c] group-focus-within:text-[#EAEAEA] transition-colors" />
              <input
                type="text"
                placeholder="Find by User ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full h-12 bg-[#141414] border border-[#242424] rounded-[16px] pl-11 pr-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-all shadow-inner placeholder:text-[#4a4a4a]"
              />
            </div>
            {/* <button className="flex items-center gap-2 h-12 px-5 bg-[#141414] border border-[#242424] rounded-[16px] text-sm font-bold text-[#8c8c8c] hover:text-[#EAEAEA] transition-all shadow-inner">
              <Calendar className="h-4 w-4" />
              Date
            </button> */}
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#242424] rounded-[24px] overflow-hidden shadow-2xl relative">
          {loading && (
            <div className="absolute inset-0 bg-[#1a1a1a]/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-[#EAEAEA] animate-spin" />
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead className="bg-[#141414] border-b border-[#242424]">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-[#8c8c8c] uppercase tracking-[0.1em]">
                  Transaction ID
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-[#8c8c8c] uppercase tracking-[0.1em]">
                  User
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-[#8c8c8c] uppercase tracking-[0.1em]">
                  Method
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-[#8c8c8c] uppercase tracking-[0.1em] text-center">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-[#8c8c8c] uppercase tracking-[0.1em]">
                  Created At
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-[#8c8c8c] uppercase tracking-[0.1em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {!loading && invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="h-8 w-8 text-[#242424]" />
                      <p className="text-sm font-bold text-[#8c8c8c]">
                        No transactions found for the selected filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-[#202020]/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-[#EAEAEA] font-mono group-hover:text-white transition-colors">
                        {tx.id.slice(0, 12)}...
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-[#8c8c8c] group-hover:text-[#EAEAEA] transition-colors">
                      {tx.user?.display_name || tx.userId.slice(0, 8) + '...'}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#242424] flex items-center justify-center border border-white/5">
                          <CreditCard className="h-4 w-4 text-[#8c8c8c]" />
                        </div>
                        <span className="text-xs font-black text-[#EAEAEA] uppercase tracking-wider">
                          {tx.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span
                          className={cn(
                            'text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/5 shadow-sm',
                            getStatusStyles(tx.status),
                          )}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#EAEAEA]">
                          {dayjs(tx.createdAt).format('MMM D, YYYY')}
                        </span>
                        <span className="text-[10px] font-medium text-[#4a4a4a]">
                          {dayjs(tx.createdAt).format('HH:mm:ss')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2.5 hover:bg-[#242424] rounded-[12px] text-[#4a4a4a] hover:text-[#EAEAEA] transition-all border border-transparent hover:border-white/5">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-8 py-5 border-t border-[#242424] bg-[#141414]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black text-[#4a4a4a] uppercase tracking-widest">
                Showing {invoices.length} of {total} transactions
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(current - 1)}
                disabled={current === 1 || loading}
                className="p-2.5 bg-[#1a1a1a] border border-[#242424] rounded-[12px] text-[#8c8c8c] hover:text-[#EAEAEA] disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-white/5 shadow-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#242424] rounded-[12px] px-4 py-2">
                <span className="text-xs font-black text-[#EAEAEA]">
                  {current}
                </span>
                <span className="text-[10px] font-bold text-[#4a4a4a]">/</span>
                <span className="text-xs font-black text-[#4a4a4a]">
                  {totalPages || 1}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(current + 1)}
                disabled={current === totalPages || loading}
                className="p-2.5 bg-[#1a1a1a] border border-[#242424] rounded-[12px] text-[#8c8c8c] hover:text-[#EAEAEA] disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-white/5 shadow-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
