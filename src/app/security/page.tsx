"use client";

import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  Activity, 
  AlertTriangle, 
  Globe, 
  Monitor,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { cn } from "@/lib/utils";

const logs = [
  { action: "Admin Login", user: "Admin", ip: "192.168.1.1", status: "Successful", time: "2 minutes ago" },
  { action: "Failed Withdrawal Attempt", user: "Ankhbayar.G", ip: "202.131.2.45", status: "Blocked", time: "15 minutes ago" },
  { action: "Case Rate Modified", user: "Manager.Z", ip: "10.0.0.14", status: "Logged", time: "1 hour ago" },
  { action: "System Config Update", user: "SuperAdmin", ip: "192.168.1.1", status: "Successful", time: "3 hours ago" },
  { action: "Suspicious API Request", user: "Unknown", ip: "45.12.99.1", status: "Flagged", time: "5 hours ago" },
];

export default function SecurityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Security" }]} />
      
      <main className="flex-1 p-8 pt-[100px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#EAEAEA]">Security & Audits</h2>
            <p className="text-sm text-[#8c8c8c] mt-1">Monitor platform health and administrative activity.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-[#E96262]/10 border border-[#E96262]/20 rounded-[10px] text-sm font-bold text-[#E96262] hover:bg-[#E96262]/20 transition-colors">
               <ShieldAlert className="h-4 w-4" />
               Emergency Lockdown
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-[#1a1a1a] border border-[#242424] rounded-[18px] overflow-hidden">
            <div className="p-6 border-b border-[#242424] flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#EAEAEA]">Live Audit Log</h3>
              <button className="text-xs font-bold text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">View All Logs</button>
            </div>
            <div className="divide-y divide-[#242424]">
              {logs.map((log, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-[#202020] transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center",
                      log.status === "Successful" || log.status === "Logged" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {log.status === "Successful" || log.status === "Logged" ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#EAEAEA]">{log.action}</p>
                      <p className="text-xs text-[#8c8c8c]">{log.user} • {log.ip}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#EAEAEA]">{log.status}</p>
                      <p className="text-[10px] text-[#8c8c8c]">{log.time}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#8c8c8c] group-hover:text-[#EAEAEA]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
              <h3 className="text-[18px] font-bold text-[#EAEAEA] mb-6">Security Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#242424]/50">
                   <div className="flex items-center gap-3">
                     <Lock className="h-4 w-4 text-[#8c8c8c]" />
                     <span className="text-sm font-semibold text-[#8c8c8c]">2FA Enforcement</span>
                   </div>
                   <span className="text-xs font-bold text-[#38B278]">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#242424]/50">
                   <div className="flex items-center gap-3">
                     <Monitor className="h-4 w-4 text-[#8c8c8c]" />
                     <span className="text-sm font-semibold text-[#8c8c8c]">Session Timeout</span>
                   </div>
                   <span className="text-xs font-bold text-[#EAEAEA]">30m</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#242424]/50">
                   <div className="flex items-center gap-3">
                     <Globe className="h-4 w-4 text-[#8c8c8c]" />
                     <span className="text-sm font-semibold text-[#8c8c8c]">IP Whitelist</span>
                   </div>
                   <span className="text-xs font-bold text-amber-500">Partial</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-[#292929] border border-[#3E3E3E] rounded-[12px] text-sm font-bold text-[#EAEAEA] hover:bg-[#333333] transition-all">
                Update Security Settings
              </button>
            </div>

            <div className="bg-[#E96262]/5 border border-[#E96262]/20 rounded-[18px] p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-[#E96262]" />
                <h4 className="text-sm font-bold text-[#E96262]">System Threats</h4>
              </div>
              <p className="text-xs text-[#8c8c8c] leading-relaxed">
                We detected 12 failed login attempts on the manager pool within the last hour. No breaches were recorded.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
