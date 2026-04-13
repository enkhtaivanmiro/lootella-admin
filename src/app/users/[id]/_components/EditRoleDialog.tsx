'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation } from '@/lib/hooks/useMutation';
import { Shield, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Role } from '@/schema';

interface EditRoleDialogProps {
  userId: string;
  currentRole: Role;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditRoleDialog({
  userId,
  currentRole,
  isOpen,
  onOpenChange,
  onSuccess,
}: EditRoleDialogProps) {
  const [role, setRole] = useState<Role>(currentRole);

  useEffect(() => {
    if (isOpen) {
      setRole(currentRole);
    }
  }, [isOpen, currentRole]);

  const { request, loading } = useMutation({
    uri: `/v1/users/${userId}/role`,
    method: 'patch',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request({ role });
      toast.success('User role updated successfully!');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handling is managed by useMutation via toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] border-[#242424] bg-[#1a1a1a] p-0 overflow-hidden rounded-[24px] shadow-2xl">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-xl font-bold text-[#EAEAEA] flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            Edit User Role
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-3">
            <label className="text-[12px] font-black text-[#8c8c8c] uppercase tracking-widest block">
              Selection
            </label>
            <div className="relative group">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full h-14 bg-[#141414] border border-[#242424] rounded-[16px] px-5 text-sm font-bold text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-all appearance-none cursor-pointer group-hover:border-[#333]"
              >
                {Object.values(Role).map((r) => (
                  <option key={r} value={r} className="bg-[#1a1a1a]">
                    {r.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8c8c8c] group-hover:text-[#EAEAEA] transition-colors">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 flex gap-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="h-14 px-8 text-[#8c8c8c] hover:text-[#EAEAEA] hover:bg-white/5 font-bold rounded-[16px] transition-all"
                >
                  Cancel
                </Button>
              }
            />
            <Button
              disabled={loading || role === currentRole}
              className="h-14 flex-1 bg-[#EAEAEA] text-[#141414] hover:bg-white font-black rounded-[16px] shadow-lg shadow-white/5 active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale"
              type="submit"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
