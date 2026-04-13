"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import Link from "next/link";
import { openAuthModalAtom } from "@/atoms/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import LootellaLogo from "@/components/common/LootellaLogo";
import { SteamIcon } from "@/assets/icons/SteamIcon";

export function AuthModal() {
  const [open, setOpen] = useAtom(openAuthModalAtom);
  const [age, setAge] = useState(false);
  const [term, setTerm] = useState(false);

  const handleSignIn = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${apiUrl}/v1/auth/steam/start`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[480px] bg-[#1a1a1a] border-[#242424] p-10 rounded-[24px]">
        <DialogHeader className="mb-8">
          <DialogTitle className="flex justify-center">
            <LootellaLogo className="w-48" />
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 mb-8">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms" 
              checked={term} 
              onCheckedChange={(checked) => setTerm(checked as boolean)}
              className="mt-1 border-[#3E3E3E] data-[state=checked]:bg-[#2D73FF] data-[state=checked]:border-[#2D73FF]"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-relaxed text-[#8c8c8c] select-none"
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
              className="text-sm font-medium leading-relaxed text-[#8c8c8c] select-none"
            >
              I&apos;m 18 years of age or older
            </label>
          </div>
        </div>

        <Button
          onClick={handleSignIn}
          disabled={!age || !term}
          className="w-full h-14 rounded-[16px] bg-[linear-gradient(90deg,#06BFFF_0%,#2D73FF_100%)] hover:opacity-90 transition-all font-bold text-base text-white gap-3 shadow-xl shadow-blue-500/10 disabled:opacity-30 disabled:grayscale"
        >
          <SteamIcon className="h-6 w-6" />
          Sign in with Steam
        </Button>

        <p className="mt-8 text-center text-xs text-[#555] font-medium leading-normal">
          By signing in, you agree to our platform&apos;s automated CS2 skin management and trade verification systems.
        </p>
      </DialogContent>
    </Dialog>
  );
}
