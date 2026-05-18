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
import { Palette, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SkinRarity, SkinItemType } from '@/schema';

interface EditSkinDialogProps {
  skinData: SkinItemType;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function EditSkinDialog({
  skinData,
  onSuccess,
  trigger,
}: EditSkinDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: skinData.name,
    base_name: (skinData as any).base_name || '',
    image: skinData.image,
    type: skinData.type,
    exterior: skinData.exterior,
    price: skinData.price,
    rarity: skinData.rarity,
    isStatTrak: skinData.isStatTrak,
  });

  const { request, loading } = useMutation({
    uri: `/v1/skins/${skinData.id}`,
    method: 'patch',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request(formData);
      toast.success('Skin updated successfully!');
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update skin');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <DialogContent className="sm:max-w-[600px] border-[#242424] bg-[#1a1a1a] p-0 overflow-hidden rounded-[20px]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-[#EAEAEA]">
            Edit Skin: {skinData.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
                Skin Name <span className="text-[#E96262] ml-0.5">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. AK-47 | Slate"
                className="w-full h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
                Base Name
              </label>
              <input
                type="text"
                value={formData.base_name}
                onChange={(e) =>
                  setFormData({ ...formData, base_name: e.target.value })
                }
                placeholder="e.g. Restricted Rifle"
                className="w-full h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
                Type
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="e.g. Rifle"
                className="w-full h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
                Price (USD)
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={isNaN(formData.price) ? '' : formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value === '' ? NaN : parseFloat(e.target.value),
                  })
                }
                className="w-full h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
                Exterior
              </label>
              <input
                type="text"
                value={formData.exterior}
                onChange={(e) =>
                  setFormData({ ...formData, exterior: e.target.value })
                }
                placeholder="e.g. Factory New"
                className="w-full h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#8c8c8c]">
                Rarity
              </label>
              <select
                value={formData.rarity}
                onChange={(e) =>
                  setFormData({ ...formData, rarity: e.target.value })
                }
                className="w-full h-11 bg-[#141414] border border-[#242424] rounded-[12px] px-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors appearance-none"
              >
                <option value="Common">Common</option>
                {Object.values(SkinRarity).map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarity}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-8">
              <Checkbox
                id="edit-isStatTrak"
                checked={formData.isStatTrak}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isStatTrak: !!checked })
                }
              />
              <label
                htmlFor="edit-isStatTrak"
                className="text-sm font-semibold text-[#EAEAEA] cursor-pointer"
              >
                StatTrak™
              </label>
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
                  {formData.image && (formData.image.startsWith('http://') || formData.image.startsWith('https://')) ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Palette className="h-5 w-5 text-[#242424]" />
                  )}
                </div>
              </div>
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
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
