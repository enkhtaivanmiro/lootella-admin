'use client';

import React from 'react';
import { TrendingUp, Users, CreditCard, Box, Calendar } from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, players: 2400 },
  { name: 'Tue', revenue: 3000, players: 1398 },
  { name: 'Wed', revenue: 2000, players: 9800 },
  { name: 'Thu', revenue: 2780, players: 3908 },
  { name: 'Fri', revenue: 1890, players: 4800 },
  { name: 'Sat', revenue: 2390, players: 3800 },
  { name: 'Sun', revenue: 3490, players: 4300 },
];

const stats = [
  {
    label: 'Total Revenue',
    value: '$124,592.00',
    change: '+14.2%',
    icon: CreditCard,
  },
  { label: 'New Players', value: '1,205', change: '+8.1%', icon: Users },
  { label: 'Cases Opened', value: '8,245', change: '+22.4%', icon: Box },
  {
    label: 'Retention Rate',
    value: '64.2%',
    change: '+2.5%',
    icon: TrendingUp,
  },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Analytics' }]}
      />

      <main className="flex-1 p-8 pt-[100px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#EAEAEA]">
            Platform Analytics
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#242424] border border-[#3E3E3E] rounded-[10px] text-sm font-semibold text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
            <Calendar className="h-4 w-4" />
            Last 7 Days
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#242424] flex items-center justify-center text-[#EAEAEA]">
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-[12px] font-bold text-[#38B278]">
                  {stat.change}
                </span>
              </div>
              <p className="text-[14px] font-semibold text-[#8c8c8c] mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-[#EAEAEA]">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <h3 className="text-[18px] font-bold text-[#EAEAEA] mb-6">
              Revenue Growth
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3E3E3E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3E3E3E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#242424"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#555"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#555"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #242424',
                      borderRadius: '8px',
                    }}
                    itemStyle={{ color: '#EAEAEA' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#EAEAEA"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <h3 className="text-[18px] font-bold text-[#EAEAEA] mb-6">
              Player Activity
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#242424"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#555"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#555"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #242424',
                      borderRadius: '8px',
                    }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar
                    dataKey="players"
                    fill="#292929"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 4 ? '#EAEAEA' : '#292929'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] overflow-hidden">
          <div className="p-6 border-b border-[#242424]">
            <h3 className="text-[18px] font-bold text-[#EAEAEA]">
              Top Performing Cases
            </h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#242424]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                  Case Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                  Openings
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {[1, 2, 3].map((i) => (
                <tr
                  key={i}
                  className="hover:bg-[#202020] transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#242424] flex items-center justify-center">
                        <Box className="h-4 w-4 text-[#8c8c8c]" />
                      </div>
                      <span className="text-sm font-semibold text-[#EAEAEA]">
                        Neon Strike Case #{i}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8c8c8c]">2,412</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#EAEAEA]">
                    $12,400.00
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-bold text-[#38B278]">
                      +12.4%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
