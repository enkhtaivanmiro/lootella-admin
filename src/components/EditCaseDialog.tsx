'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation } from '@/lib/hooks';
import { CaseType, CaseCategory, Currency, CaseMode } from '@/schema';
import { Box, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditCaseDialogProps {
  caseData: CaseType;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function EditCaseDialog({
  caseData,
  trigger,
  onSuccess,
}: EditCaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: caseData.name,
    isActive: caseData.isActive,
    image: caseData.image,
    category: caseData.category as CaseCategory,
    defaultMode: ((caseData as any).defaultMode as CaseMode) || CaseMode.DAILY,
    price: caseData.price,
    isBoost: (caseData as any).isBoost || false,
    boostPrice: (caseData as any).boostPrice || {
      amount: 0,
      currency: Currency.USD,
    },
    isJester: (caseData as any).isJester || false,
    jesterPrice: (caseData as any).jesterPrice || {
      amount: 0,
      currency: Currency.USD,
    },
  });

  const { request: updateCase, loading: updateLoading } = useMutation({
    uri: `/v1/cases/${caseData.id}`,
    method: 'patch',
  });

  const handlePriceChange = (
    field: 'price' | 'boostPrice' | 'jesterPrice',
    value: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], amount: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCase(formData);
      toast.success('Case updated successfully!');
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to update case');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <DialogContent className="sm:max-w-[600px] border-[#242424] bg-[#1a1a1a] p-0 overflow-hidden rounded-[20px] flex flex-col">
        <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-[#EAEAEA]">
            Edit Case Info: {caseData.name}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8c8c8c] uppercase">
                  Case Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full h-11 bg-[#141414] border border-[#242424] rounded-xl px-4 text-sm text-[#EAEAEA] focus:border-[#3E3E3E] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8c8c8c] uppercase">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as CaseCategory,
                    })
                  }
                  className="w-full h-11 bg-[#141414] border border-[#242424] rounded-xl px-4 text-sm text-[#EAEAEA] focus:border-[#3E3E3E] outline-none appearance-none"
                >
                  {Object.values(CaseCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace('-', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                  Price (USD)
                </label>
                <input
                  type="number"
                  value={formData.price.amount}
                  onChange={(e) =>
                    handlePriceChange('price', Number(e.target.value))
                  }
                  className="w-full h-11 bg-[#141414] border border-[#242424] rounded-xl px-4 text-sm text-[#EAEAEA] focus:border-[#3E3E3E] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                Image URL
              </label>
              <div className="flex gap-4">
                <input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                  className="flex-1 h-11 bg-[#141414] border border-[#242424] rounded-xl px-4 text-sm text-[#EAEAEA] focus:border-[#3E3E3E] outline-none transition-colors"
                />
                <div className="h-11 w-11 rounded-xl bg-[#141414] border border-[#242424] flex items-center justify-center overflow-hidden">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Box className="h-5 w-5 text-[#242424]" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                Case Mode
              </label>
              <select
                value={formData.defaultMode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultMode: e.target.value as CaseMode,
                  })
                }
                className="w-full h-11 bg-[#141414] border border-[#242424] rounded-xl px-4 text-sm text-[#EAEAEA] focus:border-[#3E3E3E] outline-none appearance-none"
              >
                {Object.values(CaseMode).map((mode) => (
                  <option key={mode} value={mode}>
                    {mode.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 py-2">
              <Checkbox
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: !!checked })
                }
              />
              <label
                htmlFor="edit-isActive"
                className="text-sm font-bold text-[#EAEAEA] cursor-pointer selection:bg-transparent"
              >
                Active and visible on the platform
              </label>
            </div>

            <div className="grid grid-cols-2 gap-6 p-4 bg-[#141414] border border-[#242424] rounded-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-isBoost"
                    checked={formData.isBoost}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isBoost: !!checked })
                    }
                  />
                  <label
                    htmlFor="edit-isBoost"
                    className="text-sm font-bold text-[#EAEAEA] cursor-pointer"
                  >
                    Boost Mode
                  </label>
                </div>
                {formData.isBoost && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                    <label className="text-[10px] font-bold text-[#8c8c8c] uppercase">
                      Boost Price
                    </label>
                    <input
                      type="number"
                      value={formData.boostPrice.amount}
                      onChange={(e) =>
                        handlePriceChange('boostPrice', Number(e.target.value))
                      }
                      className="w-full h-10 bg-[#1a1a1a] border border-[#242424] rounded-lg px-3 text-sm text-[#EAEAEA] focus:border-[#3E3E3E] outline-none"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-isJester"
                    checked={formData.isJester}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isJester: !!checked })
                    }
                  />
                  <label
                    htmlFor="edit-isJester"
                    className="text-sm font-bold text-[#EAEAEA] cursor-pointer"
                  >
                    Jester Mode
                  </label>
                </div>
                {formData.isJester && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                    <label className="text-[10px] font-bold text-[#8c8c8c] uppercase">
                      Jester Price
                    </label>
                    <input
                      type="number"
                      value={formData.jesterPrice.amount}
                      onChange={(e) =>
                        handlePriceChange('jesterPrice', Number(e.target.value))
                      }
                      className="w-full h-10 bg-[#1a1a1a] border border-[#242424] rounded-lg px-3 text-sm text-[#EAEAEA] focus:border-[#3E3E3E] outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 gap-3 border-t border-[#242424] mt-6">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 px-6 text-[#8c8c8c] font-bold"
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              disabled={updateLoading}
              className="h-11 px-8 bg-[#EAEAEA] text-[#141414] hover:bg-white font-black"
              type="submit"
            >
              {updateLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
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
