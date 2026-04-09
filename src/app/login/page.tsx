"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import LootellaLogo from "@/components/common/LootellaLogo";
import { SteamIcon } from "@/assets/icons/SteamIcon";

export default function LoginPage() {
  const [age, setAge] = useState(false);
  const [term, setTerm] = useState(false);

  const handleSignIn = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://lootella-stage.portal.mn";
    window.location.href = `${apiUrl}/v1/auth/steam/start`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#141414] p-4 font-sans">
      <div className="w-full max-w-[500px] space-y-12">
        <div className="flex flex-col items-center space-y-4">
          <LootellaLogo className="w-56" />
          <p className="text-[#8c8c8c] font-semibold text-lg">Administrator Panel</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#242424] rounded-[32px] p-10 shadow-2xl">
          <h1 className="text-2xl font-bold text-[#EAEAEA] mb-8 text-center tracking-tight">Access Dashboard</h1>
          
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                checked={term} 
                onCheckedChange={(checked) => setTerm(checked as boolean)}
                className="mt-1 border-[#3E3E3E] data-[state=checked]:bg-[#2D73FF] data-[state=checked]:border-[#2D73FF]"
              />
              <label
                htmlFor="terms"
                className="text-[13px] font-medium leading-relaxed text-[#8c8c8c] select-none"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-[#2D73FF] hover:underline underline-offset-4">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#2D73FF] hover:underline underline-offset-4">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="age" 
                checked={age} 
                onCheckedChange={(checked) => setAge(checked as boolean)}
                className="mt-1 border-[#3E3E3E] data-[state=checked]:bg-[#2D73FF] data-[state=checked]:border-[#2D73FF]"
              />
              <label
                htmlFor="age"
                className="text-[13px] font-medium leading-relaxed text-[#8c8c8c] select-none"
              >
                I&apos;m 18 years of age or older
              </label>
            </div>
          </div>

          <Button
            onClick={handleSignIn}
            disabled={!age || !term}
            className="w-full h-14 rounded-2xl bg-[linear-gradient(90deg,#06BFFF_0%,#2D73FF_100%)] hover:opacity-90 transition-all font-bold text-base text-white gap-3 shadow-xl shadow-blue-500/10 disabled:opacity-30 disabled:grayscale mb-6"
          >
            <SteamIcon className="h-6 w-6" />
            Sign in with Steam
          </Button>

          <p className="text-center text-[11px] text-[#555] font-medium leading-normal max-w-[300px] mx-auto">
            Authorized access only. All actions are logged and audited in accordance with security policy.
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 text-[#555] text-xs font-semibold">
          <Link href="/support" className="hover:text-[#8c8c8c] transition-colors">Help & Support</Link>
          <span className="h-1 w-1 rounded-full bg-[#242424]" />
          <Link href="/policy" className="hover:text-[#8c8c8c] transition-colors">Security Policy</Link>
        </div>
      </div>
    </div>
  );
}
