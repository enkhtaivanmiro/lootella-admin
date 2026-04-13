'use client';

import { useParams } from 'next/navigation';
import {
  User as UserIcon,
  Package,
  CreditCard,
  History,
  Calendar,
  Shield,
  ExternalLink,
  Ban,
  Pencil,
  RotateCcw,
  Loader2,
  Lock,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useQuery, useListQuery } from '@/lib/hooks';
import { UserType, WonItemType, PaymentType } from '@/schema';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { EditRoleDialog } from './_components/EditRoleDialog';

const RARITY_COLORS: Record<string, string> = {
  'Consumer Grade': '#afafaf',
  'Industrial Grade': '#5e98d9',
  'Mil-Spec': '#4b69ff',
  Restricted: '#8847ff',
  Classified: '#d32ee6',
  Covert: '#eb4b4b',
  Contraband: '#e4ae39',
  Extraordinary: '#e4ae39',
  Rare: '#e4ae39',
};

const RARITY_BG: Record<string, string> = {
  'Consumer Grade': 'rgba(175, 175, 175, 0.1)',
  'Industrial Grade': 'rgba(94, 152, 217, 0.1)',
  'Mil-Spec': 'rgba(75, 105, 255, 0.1)',
  Restricted: 'rgba(136, 71, 255, 0.1)',
  Classified: 'rgba(211, 46, 230, 0.1)',
  Covert: 'rgba(235, 75, 75, 0.1)',
  Contraband: 'rgba(228, 174, 57, 0.1)',
  Extraordinary: 'rgba(228, 174, 57, 0.1)',
  Rare: 'rgba(228, 174, 57, 0.1)',
};

export default function UserDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'won-items' | 'payments'
  >('overview');

  const {
    data: user,
    loading: userLoading,
    error: userError,
    fetchData: fetchUser,
  } = useQuery<UserType>({
    uri: `/v1/users/${id}/one`,
    enabled: !!id,
  });

  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);

  const {
    data: wonItems,
    loading: wonItemsLoading,
    current: wonCurrent,
    totalPages: wonPages,
    fetchData: fetchWonItems,
  } = useListQuery<WonItemType>({
    uri: `/v1/won-items/admin/${id}`,
    enabled: activeTab === 'won-items' && !!id,
    params: { page: 1, limit: 12 },
  });

  const {
    data: payments,
    loading: paymentsLoading,
    current: payCurrent,
    totalPages: payPages,
    fetchData: fetchPayments,
  } = useListQuery<PaymentType>({
    uri: `/v1/payment`,
    enabled: activeTab === 'payments' && !!id,
    params: { page: 1, limit: 12, userId: id },
  });

  if (userLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Users', href: '/users' },
            { label: 'Loading...' },
          ]}
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#EAEAEA] animate-spin" />
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Users', href: '/users' },
            { label: 'Error' },
          ]}
        />
        <div className="flex-1 flex items-center justify-center text-[#8c8c8c]">
          User not found or error loading data.
        </div>
      </div>
    );
  }

  function openDialog() {
    setIsEditRoleOpen(true);
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Users', href: '/users' },
          { label: user.display_name },
        ]}
      />

      <main className="flex-1 p-8 pt-[100px] max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-[24px] bg-[#1a1a1a] border border-[#242424] flex items-center justify-center overflow-hidden shadow-2xl">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.display_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserIcon className="h-10 w-10 text-[#8c8c8c]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-[#EAEAEA] tracking-tight">
                  {user.display_name}
                </h1>
                <span
                  className={cn(
                    'text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider',
                    user.role === 'admin'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : user.role === 'creator'
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        : 'bg-[#242424] text-[#8c8c8c] border border-white/5',
                  )}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-sm font-medium text-[#8c8c8c]">
                Steam ID: {user.account_id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <button className="flex items-center gap-2 h-11 px-6 bg-[#1a1a1a] border border-[#242424] rounded-[14px] text-sm font-bold text-[#8c8c8c] hover:text-[#EAEAEA] hover:border-white/10 transition-all">
              <RotateCcw className="h-4 w-4" />
              Reset Seeds
            </button> */}
            <button
              className="flex items-center gap-2 h-11 px-6 bg-[#1a1a1a] border border-[#242424] rounded-[14px] text-sm font-bold text-[#8c8c8c] hover:text-[#EAEAEA] hover:border-white/10 transition-all"
              onClick={() => openDialog()}
            >
              <Pencil className="h-4 w-4" />
              Edit Role
            </button>
            <button className="flex items-center gap-2 h-11 px-6 bg-red-500/10 border border-red-500/20 rounded-[14px] text-sm font-bold text-red-500 hover:bg-red-500 hover:text-[#141414] transition-all">
              <Ban className="h-4 w-4" />
              Ban User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Level', value: `Lvl ${user.level}`, icon: Loader2 },
            {
              label: 'Purchase Status',
              value: user.is_purchased ? 'Active' : 'Missing',
              icon: Shield,
              color: user.is_purchased ? 'text-emerald-500' : 'text-[#8c8c8c]',
            },
            {
              label: 'Joined At',
              value: dayjs(user.createdAt).format('YYYY-MM-DD'),
              icon: Calendar,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#1a1a1a] border border-[#242424] rounded-[20px] p-6 hover:border-[#3E3E3E] transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <stat.icon className="h-4 w-4 text-[#8c8c8c] group-hover:text-[#EAEAEA] transition-colors" />
                <span className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
              <p
                className={cn('text-xl font-black text-[#EAEAEA]', stat.color)}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex border-b border-[#242424] mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: UserIcon },
            { id: 'won-items', label: 'Won Items', icon: Package },
            { id: 'payments', label: 'Payments', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2.5 px-8 py-4 text-sm font-bold transition-all relative min-w-max',
                activeTab === tab.id
                  ? 'text-[#EAEAEA]'
                  : 'text-[#8c8c8c] hover:text-[#EAEAEA]',
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EAEAEA] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              <div className="bg-[#1a1a1a] border border-[#242424] rounded-[24px] p-8">
                <h3 className="text-lg font-bold text-[#EAEAEA] mb-6 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  Security & Identification
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest block mb-2">
                      User ID
                    </label>
                    <div className="bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#EAEAEA] font-mono flex items-center justify-between">
                      {user.id}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest block mb-2">
                      Server Seed Hash
                    </label>
                    <div className="bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#8c8c8c] font-mono break-all leading-relaxed">
                      {user.serverSeedHash}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest block mb-2">
                      Client Seed
                    </label>
                    <div className="bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#EAEAEA] font-mono">
                      {user.clientSeed}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border border-[#242424] rounded-[24px] p-8">
                <h3 className="text-lg font-bold text-[#EAEAEA] mb-6 flex items-center gap-3">
                  <History className="h-5 w-5 text-blue-500" />
                  Engagement & Metadata
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest block mb-2">
                        Referral Code
                      </label>
                      <div className="bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-blue-500 font-bold">
                        {user.ref_code || '---'}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest block mb-2">
                        Referred By
                      </label>
                      <div className="bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#EAEAEA] font-bold">
                        {user.referred_by_code || 'None'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest block mb-2">
                      Trade URL
                    </label>
                    <div className="bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#8c8c8c] truncate flex items-center justify-between">
                      {user.trade_url || 'Not connected'}
                      {user.trade_url && <ExternalLink className="h-3 w-3" />}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest block mb-2">
                      Last Update
                    </label>
                    <p className="text-sm text-[#EAEAEA] font-medium">
                      {dayjs(user.updatedAt).format('MMMM D, YYYY HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'won-items' && (
            <div className="animate-in fade-in duration-500">
              {wonItemsLoading ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="h-8 w-8 text-[#8c8c8c] animate-spin" />
                </div>
              ) : wonItems.length === 0 ? (
                <div className="py-20 text-center border border-[#242424] border-dashed rounded-[24px] text-[#8c8c8c]">
                  No won items found.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {wonItems.map((item) => {
                      const rarityColor =
                        RARITY_COLORS[item.skin.rarity] || '#ffffff';
                      const rarityBg =
                        RARITY_BG[item.skin.rarity] ||
                        'rgba(255, 255, 255, 0.05)';
                      return (
                        <div
                          key={item.id}
                          className="bg-[#1a1a1a] border border-[#242424] rounded-[24px] p-4 flex flex-col hover:border-[#3E3E3E] transition-all relative overflow-hidden group"
                        >
                          <div
                            className="absolute top-0 left-0 right-0 h-1"
                            style={{ backgroundColor: rarityColor }}
                          />
                          <div
                            className="h-28 w-full mb-4 flex items-center justify-center p-2 rounded-xl transition-colors"
                            style={{ backgroundColor: rarityBg }}
                          >
                            <img
                              src={item.skin.image}
                              alt={item.skin.name}
                              className="h-full w-full object-contain drop-shadow-2xl"
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-[9px] font-black uppercase tracking-widest mb-1.5"
                              style={{ color: rarityColor }}
                            >
                              {item.skin.rarity}
                            </p>
                            <h4 className="text-xs font-bold text-[#EAEAEA] line-clamp-1 mb-2">
                              {item.skin.name}
                            </h4>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-[10px] font-black text-[#EAEAEA]">
                                ${item.skin.price.toFixed(2)}
                              </span>
                              <span
                                className={cn(
                                  'text-[8px] font-black px-1.5 py-0.5 rounded uppercase',
                                  item.status === 'available'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-[#242424] text-[#8c8c8c]',
                                )}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                          {item.isLocked && (
                            <div className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-lg backdrop-blur-sm border border-white/5">
                              <Lock className="h-3 w-3 text-emerald-500" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {wonPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                      <button
                        disabled={wonCurrent === 1}
                        onClick={() => fetchWonItems({ page: wonCurrent - 1 })}
                        className="p-2 text-[#8c8c8c] hover:text-white disabled:opacity-30"
                      >
                        <ChevronLeft />
                      </button>
                      <span className="flex items-center text-sm font-bold text-[#EAEAEA] px-4">
                        Page {wonCurrent} of {wonPages}
                      </span>
                      <button
                        disabled={wonCurrent === wonPages}
                        onClick={() => fetchWonItems({ page: wonCurrent + 1 })}
                        className="p-2 text-[#8c8c8c] hover:text-white disabled:opacity-30"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="animate-in fade-in duration-500">
              <div className="bg-[#1a1a1a] border border-[#242424] rounded-[24px] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#242424]">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest">
                        ID / Created At
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest">
                        Method
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest text-center">
                        Status
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest text-right">
                        Paid At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242424]">
                    {paymentsLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                          <Loader2 className="h-6 w-6 text-[#8c8c8c] animate-spin inline-block" />
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-20 text-center text-sm text-[#8c8c8c]"
                        >
                          No payment history found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-[#202020] transition-colors group"
                        >
                          <td className="px-6 py-5">
                            <p className="text-[11px] font-mono text-[#EAEAEA] mb-1">
                              {p.id.slice(0, 18)}...
                            </p>
                            <p className="text-[10px] text-[#8c8c8c]">
                              {dayjs(p.createdAt).format('YYYY-MM-DD HH:mm')}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-xs font-bold text-[#EAEAEA] uppercase tracking-wider">
                              {p.method}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span
                              className={cn(
                                'text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider',
                                p.status === 'success'
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : p.status === 'pending'
                                    ? 'bg-yellow-500/10 text-yellow-500'
                                    : 'bg-red-500/10 text-red-500',
                              )}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right text-xs font-bold text-[#EAEAEA]">
                            {p.paid_at
                              ? dayjs(p.paid_at).format('YYYY-MM-DD HH:mm')
                              : '---'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {payPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    disabled={payCurrent === 1}
                    onClick={() =>
                      fetchPayments({ page: payCurrent - 1, userId: id })
                    }
                    className="p-2 text-[#8c8c8c] hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft />
                  </button>
                  <span className="flex items-center text-sm font-bold text-[#EAEAEA] px-4">
                    Page {payCurrent} of {payPages}
                  </span>
                  <button
                    disabled={payCurrent === payPages}
                    onClick={() =>
                      fetchPayments({ page: payCurrent + 1, userId: id })
                    }
                    className="p-2 text-[#8c8c8c] hover:text-white disabled:opacity-30"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <EditRoleDialog
        userId={id as string}
        currentRole={user?.role}
        isOpen={isEditRoleOpen}
        onOpenChange={setIsEditRoleOpen}
        onSuccess={() => {
          fetchUser();
        }}
      />
    </div>
  );
}
