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
import { useMutation } from '@/lib/hooks/useMutation';
import { Plus, Box, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { CaseCategory, Currency, CaseMode } from '@/schema';

interface CreateCaseDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateCaseDialog({
  onSuccess,
  trigger,
}: CreateCaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    image: '',
    category: CaseCategory.REGULAR,
    defaultMode: CaseMode.DAILY,
    price: { amount: 0, currency: Currency.USD },
    isBoost: false,
    boostPrice: { amount: 0, currency: Currency.USD },
    isJester: false,
    jesterPrice: { amount: 0, currency: Currency.USD },
  });

  const { request, loading } = useMutation({
    uri: '/v1/cases',
    method: 'post',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request(formData);
      toast.success('Case created successfully!');
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {}
  };

  const handlePriceChange = (
    field: 'price' | 'boostPrice' | 'jesterPrice',
    value: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], amount: value },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="bg-[#EAEAEA] text-[#141414] hover:bg-white font-bold rounded-[10px]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Case
        </Button>
      )}

      <DialogContent className="sm:max-w-[600px] border-[#242424] bg-[#1a1a1a] p-0 overflow-hidden rounded-[20px]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-[#EAEAEA]">
            Create New Case
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
                Case Name <span className="text-[#E96262] ml-0.5">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter case name"
                className="w-full h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
              />
            </div>
            {/* Category */}
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
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
                className="w-full h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors appearance-none"
              >
                {Object.values(CaseCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
                Basic Price (USD)
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={formData.price.amount}
                onChange={(e) =>
                  handlePriceChange('price', parseFloat(e.target.value))
                }
                className="w-full h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
                Image URL <span className="text-[#E96262] ml-0.5">*</span>
              </label>
              <div className="flex gap-4">
                <input
                  required
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                  className="flex-1 h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
                />
                <div className="h-11 w-11 rounded-[12px] bg-[#141414] border border-[#242424] flex items-center justify-center overflow-hidden">
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
            <div className="col-span-2 space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
                Case Mode <span className="text-[#E96262] ml-0.5">*</span>
              </label>
              <div className="flex gap-4">
                <select
                  required
                  value={formData.defaultMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultMode: e.target.value as CaseMode,
                    })
                  }
                  className="flex-1 h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
                >
                  {Object.values(CaseMode).map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2 flex items-center gap-2 py-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: !!checked })
                }
              />
              <label
                htmlFor="isActive"
                className="text-sm font-semibold text-[#EAEAEA] cursor-pointer selection:bg-transparent"
              >
                Active and visible on the platform
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#242424]">
            {/* Boost Mode */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isBoost"
                  checked={formData.isBoost}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isBoost: !!checked })
                  }
                />
                <label
                  htmlFor="isBoost"
                  className="text-sm font-bold text-[#EAEAEA] cursor-pointer"
                >
                  Enable Boost Mode
                </label>
              </div>
              {formData.isBoost && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[12px] font-semibold text-[#8c8c8c]">
                    Boost Price (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.boostPrice.amount}
                    onChange={(e) =>
                      handlePriceChange(
                        'boostPrice',
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full h-10 bg-[#141414] border border-[#242424] rounded-[10px] px-3 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E]"
                  />
                </div>
              )}
            </div>

            {/* Jester Mode */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isJester"
                  checked={formData.isJester}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isJester: !!checked })
                  }
                />
                <label
                  htmlFor="isJester"
                  className="text-sm font-bold text-[#EAEAEA] cursor-pointer"
                >
                  Enable Jester Mode
                </label>
              </div>
              {formData.isJester && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[12px] font-semibold text-[#8c8c8c]">
                    Jester Price (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.jesterPrice.amount}
                    onChange={(e) =>
                      handlePriceChange(
                        'jesterPrice',
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full h-10 bg-[#141414] border border-[#242424] rounded-[10px] px-3 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E]"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-6 gap-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 px-6 text-[#8c8c8c] hover:text-[#EAEAEA] hover:bg-white/5 font-bold"
                >
                  Cancel
                </Button>
              }
            />
            <Button
              disabled={loading}
              className="h-11 px-8 bg-[#EAEAEA] text-[#141414] hover:bg-white font-black shadow-lg shadow-white/5 active:scale-[0.98] transition-all"
              type="submit"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Create Case'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
