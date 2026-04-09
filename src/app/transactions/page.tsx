"use client";

import React, { useState } from "react";
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
  MoreHorizontal
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { cn } from "@/lib/utils";

const transactions = [
  { id: "TX-9402", user: "Battulga.E", type: "Deposit", method: "Crypto (BTC)", amount: "+$250.00", status: "Success", date: "2024.04.09 14:20" },
  { id: "TX-9401", user: "Zolboo.S", type: "Withdrawal", method: "Bank Transfer", amount: "-$1,200.00", status: "Pending", date: "2024.04.09 12:45" },
  { id: "TX-9400", user: "Ankhbayar.G", type: "Deposit", method: "Credit Card", amount: "+$50.00", status: "Failed", date: "2024.04.09 10:30" },
  { id: "TX-9399", user: "Ondrakh.D", type: "Withdrawal", method: "Crypto (ETH)", amount: "-$420.00", status: "Success", date: "2024.04.08 22:15" },
  { id: "TX-9398", user: "Munkhbat.B", type: "Deposit", method: "Crypto (SOL)", amount: "+$1,000.00", status: "Success", date: "2024.04.08 19:40" },
];

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Transactions" }]} />
      
      <main className="flex-1 p-8 pt-[100px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#EAEAEA]">Transaction Logs</h2>
            <p className="text-sm text-[#8c8c8c] mt-1">Monitor all financial movements on the platform.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#242424] border border-[#3E3E3E] rounded-[10px] text-sm font-bold text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex h-11 bg-[#1a1a1a] border border-[#242424] rounded-[12px] p-1">
            {["All", "Deposits", "Withdrawals", "Refunds"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 h-full rounded-[8px] text-sm font-bold transition-all",
                  activeTab === tab 
                    ? "bg-[#292929] text-[#EAEAEA] shadow-sm" 
                    : "text-[#8c8c8c] hover:text-[#EAEAEA]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8c8c]" />
              <input 
                type="text" 
                placeholder="Find TX ID or user..."
                className="w-full h-11 bg-[#1a1a1a] border border-[#242424] rounded-[12px] pl-10 pr-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E]"
              />
            </div>
            <button className="flex items-center gap-2 h-11 px-4 bg-[#1a1a1a] border border-[#242424] rounded-[12px] text-sm font-semibold text-[#8c8c8c] hover:text-[#EAEAEA]">
              <Calendar className="h-4 w-4" />
              Date
            </button>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#242424]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Amount / Method</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#202020] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#EAEAEA] font-mono">{tx.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#EAEAEA]">{tx.user}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       {tx.type === "Deposit" ? (
                         <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
                       ) : (
                         <ArrowUpRight className="h-4 w-4 text-red-500" />
                       )}
                       <div>
                         <p className={cn(
                           "text-sm font-bold",
                           tx.type === "Deposit" ? "text-emerald-500" : "text-[#EAEAEA]"
                         )}>{tx.amount}</p>
                         <p className="text-xs text-[#8c8c8c]">{tx.method}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                      tx.status === "Success" && "bg-emerald-500/10 text-emerald-500",
                      tx.status === "Pending" && "bg-amber-500/10 text-amber-500",
                      tx.status === "Failed" && "bg-red-500/10 text-red-500"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8c8c8c]">{tx.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#292929] rounded-lg text-[#8c8c8c] hover:text-[#EAEAEA]">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#242424] bg-[#1a1a1a]">
            <p className="text-xs text-[#8c8c8c]">Showing 5 of 8,402 transactions</p>
            <div className="flex items-center gap-2">
              <button className="p-1 text-[#8c8c8c] hover:text-[#EAEAEA]">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="px-2 py-1 text-xs font-bold bg-[#EAEAEA] text-[#141414] rounded-md">1</button>
              <button className="p-1 text-[#8c8c8c] hover:text-[#EAEAEA]">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
