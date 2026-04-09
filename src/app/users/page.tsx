"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  Ban,
  Mail,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { cn } from "@/lib/utils";

const users = [
  { id: "1", name: "Battulga.E", email: "battulga@lootella.com", balance: "$1,240.00", status: "Active", joined: "2024.01.12" },
  { id: "2", name: "Ankhbayar.G", email: "ankhaa@lootella.com", balance: "$420.50", status: "Banned", joined: "2024.02.05" },
  { id: "3", name: "Zolboo.S", email: "zolboo@lootella.com", balance: "$12,400.00", status: "Active", joined: "2023.12.20" },
  { id: "4", name: "Munkhbat.B", email: "munkh@lootella.com", balance: "$50.00", status: "Active", joined: "2024.03.01" },
  { id: "5", name: "Ondrakh.D", email: "onoo@lootella.com", balance: "$0.00", status: "Inactive", joined: "2024.02.28" },
];

export default function UsersPage() {
  const [q, setQ] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Users" }]} />
      
      <main className="flex-1 p-8 pt-[100px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#EAEAEA]">User Management</h2>
            <p className="text-sm text-[#8c8c8c] mt-1">Manage and monitor platform participants.</p>
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
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 h-11 px-4 bg-[#1a1a1a] border border-[#242424] rounded-[12px] text-sm font-semibold text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#242424]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Balance</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#202020] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#242424] flex items-center justify-center text-[#8c8c8c] font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#EAEAEA]">{user.name}</p>
                        <p className="text-xs text-[#8c8c8c]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#EAEAEA]">{user.balance}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                      user.status === "Active" && "bg-emerald-500/10 text-emerald-500",
                      user.status === "Banned" && "bg-red-500/10 text-red-500",
                      user.status === "Inactive" && "bg-amber-500/10 text-amber-500"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8c8c8c]">{user.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-[#292929] rounded-lg text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className={cn(
                        "p-2 hover:bg-[#292929] rounded-lg transition-colors",
                        user.status === "Banned" ? "text-emerald-500" : "text-red-500"
                      )}>
                        <Ban className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-[#292929] rounded-lg text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#242424] bg-[#1a1a1a]">
            <p className="text-xs text-[#8c8c8c]">Showing 1 to 5 of 1,205 users</p>
            <div className="flex items-center gap-2">
              <button disabled className="p-1 text-[#8c8c8c] disabled:opacity-30">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="px-2 py-1 text-xs font-bold bg-[#EAEAEA] text-[#141414] rounded-md">1</button>
              <button className="px-2 py-1 text-xs font-bold text-[#8c8c8c] hover:text-[#EAEAEA]">2</button>
              <button className="px-2 py-1 text-xs font-bold text-[#8c8c8c] hover:text-[#EAEAEA]">3</button>
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
