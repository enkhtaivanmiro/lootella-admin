"use client";

import React from "react";
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
  ChevronRight
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { cn } from "@/lib/utils";

const cases = [
  { id: "1", name: "Cyberpunk 2077 Chest", price: "450 Gold", type: "Premium", status: "Active", openings: "12,400" },
  { id: "2", name: "Neon Strike Crate", price: "120 Coins", type: "Standard", status: "Active", openings: "45,210" },
  { id: "3", name: "Dragon Lore Mystery", price: "2,500 Gold", type: "V.I.P", status: "Active", openings: "1,205" },
  { id: "4", name: "Budget Starter Pack", price: "50 Coins", type: "Free", status: "Archived", openings: "150,000" },
  { id: "5", name: "Limited Edition Lunar", price: "800 Gold", type: "Event", status: "Draft", openings: "0" },
];

export default function CasesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cases" }]} />
      
      <main className="flex-1 p-8 pt-[100px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#EAEAEA]">Case Management</h2>
            <p className="text-sm text-[#8c8c8c] mt-1">Configure drop rates and case visibility.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#EAEAEA] rounded-[10px] text-sm font-bold text-[#141414] hover:bg-white transition-colors">
            <Plus className="h-4 w-4" />
            Create Case
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">Total Active Cases</p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">42</h4>
          </div>
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">Daily Openings</p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">8,245</h4>
          </div>
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">Items in Pool</p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">1,402</h4>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8c8c]" />
            <input 
              type="text" 
              placeholder="Filter cases by name or type..."
              className="w-full h-11 bg-[#1a1a1a] border border-[#242424] rounded-[12px] pl-10 pr-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
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

        <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#242424]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Preview</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Case Name</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Price / Type</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Avg. Openings</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-[#202020] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="h-12 w-12 rounded-lg bg-[#242424] border border-[#3E3E3E] flex items-center justify-center">
                      <Box className="h-6 w-6 text-[#8c8c8c]" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#EAEAEA]">{c.name}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#EAEAEA]">{c.price}</p>
                    <p className="text-xs text-[#8c8c8c] uppercase font-bold tracking-tight">{c.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                      c.status === "Active" && "bg-emerald-500/10 text-emerald-500",
                      c.status === "Archived" && "bg-[#8c8c8c]/10 text-[#8c8c8c]",
                      c.status === "Draft" && "bg-amber-500/10 text-amber-500"
                    )}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8c8c8c]">{c.openings}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-[#292929] rounded-lg text-[#8c8c8c] hover:text-[#EAEAEA]">
                        <Eye className="h-4 w-4" />
                      </button>
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
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#242424] bg-[#1a1a1a]">
            <p className="text-xs text-[#8c8c8c]">Showing 5 of 42 cases</p>
            <div className="flex items-center gap-2">
              <button disabled className="p-1 text-[#8c8c8c] disabled:opacity-30">
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
