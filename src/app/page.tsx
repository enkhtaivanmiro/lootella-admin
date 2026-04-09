'use client';

import React from 'react';
import {
  Users,
  Box,
  CreditCard,
  Gamepad2,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Active Players', value: '2,842', change: '+12.5%', icon: Users },
  { label: 'Cases Opened', value: '14,205', change: '+8.2%', icon: Box },
  {
    label: 'Pool Revenue',
    value: '$42,105.00',
    change: '+15.3%',
    icon: CreditCard,
  },
  { label: 'Win Rate', value: '42.1%', change: '-2.1%', icon: TrendingUp },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb items={[{ label: 'Home' }]} />

      <main className="flex-1 p-8 pt-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6 hover:border-[#3E3E3E] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#242424] flex items-center justify-center text-[#EAEAEA] group-hover:bg-[#292929]">
                  <stat.icon className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#8c8c8c] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[14px] font-semibold text-[#8c8c8c] mb-1">
                {stat.label}
              </p>
              <div className="flex items-end gap-3">
                <h3 className="text-2xl font-bold text-[#EAEAEA]">
                  {stat.value}
                </h3>
                <span
                  className={cn(
                    'text-[12px] font-bold mb-1',
                    stat.change.startsWith('+')
                      ? 'text-[#38B278]'
                      : 'text-[#E96262]',
                  )}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[18px] font-bold text-[#EAEAEA] mb-4">
              Recent Transactions
            </h4>
            <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border-b border-[#242424] last:border-0 hover:bg-[#202020] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#242424] flex items-center justify-center text-[#8c8c8c]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#EAEAEA]">
                        User_Player_{i}
                      </p>
                      <p className="text-xs text-[#8c8c8c]">
                        Case Opening • 5 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#EAEAEA]">$42.50</p>
                      <p className="text-[10px] text-[#38B278] font-bold uppercase tracking-wider">
                        Success
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#8c8c8c] group-hover:text-[#EAEAEA] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[18px] font-bold text-[#EAEAEA] mb-4">
              System Status
            </h4>
            <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#8c8c8c]">
                  API Server
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-1 rounded-full uppercase">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#8c8c8c]">
                  Game Engine
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-1 rounded-full uppercase">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#8c8c8c]">
                  Withdrawals
                </span>
                <span className="text-[10px] bg-[#E96262]/10 text-[#E96262] font-bold px-2 py-1 rounded-full uppercase">
                  Delayed
                </span>
              </div>
              <div className="pt-4 border-t border-[#242424]">
                <button className="w-full h-11 rounded-[12px] bg-[#292929] border border-[#3E3E3E] text-[#EAEAEA] text-sm font-bold hover:bg-[#333333] transition-colors">
                  Check All Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
