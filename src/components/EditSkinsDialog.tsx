'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { useMutation, useListQuery } from '@/lib/hooks';
import api from '@/lib/api';
import {
  CaseType,
  SkinItemType,
  SkinExterior,
} from '@/schema';
import {
  Loader2,
  Search,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowUpAZ,
  ArrowDownZA,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
const RARITY_TYPES = [
  { value: 'consumer', label: 'Consumer Grade', color: '#b0c3d9' },
  { value: 'industrial', label: 'Industrial Grade', color: '#5e98d9' },
  { value: 'mil-spec', label: 'Mil-Spec Grade', color: '#4b69ff' },
  { value: 'restricted', label: 'Restricted', color: '#8847ff' },
  { value: 'classified', label: 'Classified', color: '#d32ce6' },
  { value: 'covert', label: 'Covert', color: '#eb4b4b' },
  { value: 'contraband', label: 'Contraband', color: '#e4ae39' },
  { value: 'extraordinary', label: 'Extraordinary', color: '#e4ae39' },
];

const WEAPON_TYPES = [
  { label: 'Rifle', value: ['AK-47', 'AUG', 'AWP', 'FAMAS', 'G3SG1', 'Galil AR', 'M4A1-S', 'M4A4', 'SCAR-20', 'SG 553', 'SSG 08'] },
  { label: 'Knife', value: ['Bayonet', 'Bowie', 'Butterfly', 'Classic', 'Falchion', 'Flip', 'Gut', 'Huntsman', 'Karambit', 'M9 Bayonet', 'Navaja', 'Nomad', 'Paracord', 'Shadow Daggers', 'Skeleton', 'Stiletto', 'Survival', 'Talon', 'Ursus', 'Kukri'] },
  { label: 'SMG', value: ['MAC-10', 'MP5-SD', 'MP7', 'MP9', 'P90', 'PP-Bizon', 'UMP-45'] },
  { label: 'Gloves', value: ['Bloodhound', 'Driver', 'Hand Wraps', 'Hydra', 'Moto', 'Specialist', 'Sport', 'Broken Fang'] },
  { label: 'Pistol', value: ['CZ75-Auto', 'Desert Eagle', 'Dual Berettas', 'Five-SeveN', 'Glock-18', 'P2000', 'P250', 'R8 Revolver', 'Tec-9', 'USP-S', 'Zeus x27'] },
  { label: 'Heavy', value: ['M249', 'MAG-7', 'Negev', 'Nova', 'Sawed-Off', 'XM1014'] },
  { label: 'Sticker', value: ['Sticker'] },
];

interface EditSkinsDialogProps {
  caseData: CaseType;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const splitSkinName = (name: string) => {
  if (name.includes('|')) {
    const [type, skinName] = name.split('|').map((s) => s.trim());
    return { type, name: skinName };
  }
  return { type: '', name };
};

export function EditSkinsDialog({
  caseData,
  trigger,
  onSuccess,
}: EditSkinsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSkins, setSelectedSkins] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState({
    name: '',
    order: 'DESC' as 'ASC' | 'DESC',
    page: 1,
    exterior: [] as string[],
    rarity: [] as string[],
    type: [] as string[],
    isStatTrak: false,
  });

  const {
    data: skins,
    loading: skinsLoading,
    fetchData: fetchSkins,
    current,
    totalPages,
    total,
  } = useListQuery<SkinItemType>({
    uri: '/v1/skins/avl',
    enabled: open,
    params: { limit: 20, sortBy: 'price', order: searchParams.order },
  });

  const { request: setSkins, loading: updateLoading } = useMutation({
    uri: `/v1/cases/${caseData.id}/set-items`,
    method: 'post',
  });

  useEffect(() => {
    if (open) {
      fetchCurrentItems();
    }
  }, [open]);

  const fetchCurrentItems = async () => {
    try {
      const data: any = await api.get(`/v1/cases/${caseData.slug}`);
      if (data.containers && data.containers.length > 0) {
        const itemIds = data.containers[0].items.map(
          (item: any) => item.itemId,
        );
        setSelectedSkins(itemIds);
      }
    } catch (error) {
      console.error('Failed to fetch case items', error);
    }
  };

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (params: Partial<typeof searchParams>) => {
    const nextParams = { ...searchParams, ...params };
    setSearchParams(nextParams);
    
    const apiParams: any = {
      ...nextParams,
      sortBy: 'price',
      limit: 20,
    };
    
    if (apiParams.type.length === 0) delete apiParams.type;
    if (!apiParams.isStatTrak) delete apiParams.isStatTrak;

    fetchSkins(apiParams);
  };

  const toggleFilterArray = (key: 'exterior' | 'rarity', value: string) => {
    const currentList = [...searchParams[key]];
    const nextList = currentList.includes(value)
      ? currentList.filter((v) => v !== value)
      : [...currentList, value];
    
    handleFilterChange({ [key]: nextList, page: 1 });
  };

  const toggleTypeCategory = (categoryValues: string[]) => {
    const currentTypes = [...searchParams.type];
    const hasCategory = categoryValues.every(v => currentTypes.includes(v));

    let nextTypes;
    if (hasCategory) {
      nextTypes = currentTypes.filter(t => !categoryValues.includes(t));
    } else {
      nextTypes = Array.from(new Set([...currentTypes, ...categoryValues]));
    }

    handleFilterChange({ type: nextTypes, page: 1 });
  };

  const toggleSkin = (id: string) => {
    setSelectedSkins((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSkins.length > 0) {
        await setSkins({
          items: selectedSkins.map((id) => ({
            skinId: id,
            probability: 100 / selectedSkins.length,
          })),
        });
      }
      toast.success('Skins updated successfully!');
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to update skins');
    }
  };

  const sortedSkins = useMemo(() => {
    if (!skins) return [];
    return [...skins].sort((a, b) => {
      const aSel = selectedSkins.includes(a.id);
      const bSel = selectedSkins.includes(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;
      return 0;
    });
  }, [skins, selectedSkins]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <DialogContent className="sm:max-w-[1100px] max-h-[95vh] border-[#242424] bg-[#141414] p-0 overflow-hidden rounded-[24px] flex flex-col shadow-2xl">
        <DialogHeader className="p-8 pb-4 flex flex-row items-center justify-between border-b border-[#242424]">
          <div>
            <DialogTitle className="text-2xl font-black text-[#EAEAEA] tracking-tight">
              Manage Inventory: {caseData.name}
            </DialogTitle>
            <p className="text-sm text-[#8c8c8c] font-bold mt-1">
              Configure items and drop rates for this case.
            </p>
          </div>
          <div className="bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#242424]">
            <p className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest">
              Selected
            </p>
            <p className="text-lg font-black text-emerald-500">
              {selectedSkins.length} <span className="text-xs text-[#8c8c8c]">skins</span>
            </p>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col bg-[#111]">
          <div className="p-6 bg-[#141414] border-b border-[#242424] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8c8c]" />
                <input
                  placeholder="Search skins..."
                  className="w-full h-12 bg-[#0d0d0d] border border-[#242424] rounded-2xl pl-12 pr-4 text-sm text-[#EAEAEA] focus:border-[#444] outline-none transition-all placeholder:text-[#444]"
                  value={searchParams.name}
                  onChange={(e) => handleFilterChange({ name: e.target.value, page: 1 })}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'h-12 px-6 rounded-2xl border flex items-center gap-2 text-sm font-black transition-all',
                  showFilters
                    ? 'bg-[#EAEAEA] border-[#EAEAEA] text-[#141414]'
                    : 'bg-[#1a1a1a] border-[#242424] text-[#8c8c8c] hover:border-[#333]',
                )}
              >
                <Filter className="h-4 w-4" />
                Advanced Filters
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-2xl border border-[#242424]">
                <Checkbox 
                  id="stattrak-filter" 
                  checked={searchParams.isStatTrak} 
                  onCheckedChange={(val) => handleFilterChange({ isStatTrak: !!val, page: 1 })}
                />
                <label htmlFor="stattrak-filter" className="text-xs font-bold text-[#8c8c8c] cursor-pointer">StatTrak</label>
              </div>

              <button
                onClick={() => handleFilterChange({ order: searchParams.order === 'ASC' ? 'DESC' : 'ASC', page: 1 })}
                className="h-12 px-4 bg-[#1a1a1a] border border-[#242424] rounded-2xl text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors flex items-center gap-2"
              >
                {searchParams.order === 'ASC' ? (
                  <>
                    <ArrowUpAZ className="h-4 w-4" />
                    <span className="text-xs font-bold">Price: Low to High</span>
                  </>
                ) : (
                  <>
                    <ArrowDownZA className="h-4 w-4" />
                    <span className="text-xs font-bold">Price: High to Low</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {showFilters && (
              <div className="p-6 bg-[#1a1a1a] border-b border-[#242424] grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#444] uppercase tracking-[0.2em]">Rarity</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {RARITY_TYPES.map(({ label, color }) => (
                      <div key={label} className="flex items-center gap-2">
                        <Checkbox
                          id={`rarity-${label}`}
                          checked={searchParams.rarity.includes(label)}
                          onCheckedChange={() => toggleFilterArray('rarity', label)}
                        />
                        <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <label htmlFor={`rarity-${label}`} className="text-xs font-bold text-[#888] hover:text-[#EAEAEA] cursor-pointer transition-colors uppercase">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#444] uppercase tracking-[0.2em]">Exterior</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.values(SkinExterior).map((val) => (
                      <div key={val} className="flex items-center gap-2">
                        <Checkbox
                          id={`ext-${val}`}
                          checked={searchParams.exterior.includes(val)}
                          onCheckedChange={() => toggleFilterArray('exterior', val)}
                        />
                        <label htmlFor={`ext-${val}`} className="text-xs font-bold text-[#888] hover:text-[#EAEAEA] cursor-pointer transition-colors uppercase">
                          {val}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#444] uppercase tracking-[0.2em]">Weapon Type</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {WEAPON_TYPES.map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-2">
                        <Checkbox
                          id={`type-${label}`}
                          checked={value.every(v => searchParams.type.includes(v))}
                          onCheckedChange={() => toggleTypeCategory(value)}
                        />
                        <label htmlFor={`type-${label}`} className="text-xs font-bold text-[#888] hover:text-[#EAEAEA] cursor-pointer transition-colors uppercase">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {skinsLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
                  <Loader2 className="h-12 w-12 text-[#EAEAEA] animate-spin" />
                  <p className="text-sm font-black text-[#EAEAEA] uppercase tracking-widest">Updating Inventory...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {sortedSkins.map((skin) => {
                    const isSelected = selectedSkins.includes(skin.id);
                    const { type, name } = splitSkinName(skin.name);
                    const rarityColor = RARITY_TYPES.find(r => r.label === skin.rarity)?.color || '#333';

                    return (
                      <div
                        key={skin.id}
                        onClick={() => toggleSkin(skin.id)}
                        className={cn(
                          'relative group cursor-pointer bg-[#1a1a1a] border rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95',
                          isSelected ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' : 'border-[#242424] hover:border-[#333]'
                        )}
                      >
                        <div 
                          className="absolute inset-x-0 bottom-0 h-1/2 opacity-30 pointer-events-none"
                          style={{
                            background: `linear-gradient(to top, ${rarityColor}44 0%, transparent 100%)`
                          }}
                        />

                        <div className="absolute top-4 left-4 z-10 flex gap-1">
                          <span className={cn(
                            "text-[9px] font-black uppercase bg-[#000]/30 px-2 py-0.5 rounded-full backdrop-blur-sm",
                            skin.isStatTrak ? "text-orange-400" : "text-[#444]"
                          )}>
                            {(skin as any).marketHashName?.split('(').pop()?.replace(')', '') || 'FN'}
                          </span>
                          {skin.isStatTrak && (
                             <span className="text-[9px] font-black text-orange-400 uppercase bg-orange-400/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                              ST
                            </span>
                          )}
                        </div>

                        <div className={cn(
                          'absolute top-4 right-4 z-20 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300',
                          isSelected ? 'bg-emerald-500 text-[#000] scale-100' : 'bg-[#000]/40 text-[#fff]/20 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100'
                        )}>
                          {isSelected ? <Check className="h-4 w-4 stroke-[4]" /> : <Plus className="h-4 w-4 stroke-[4]" />}
                        </div>

                        <div className="p-6 relative">
                          <div className="relative aspect-square mb-6 group-hover:rotate-12 transition-transform duration-500">
                            <div 
                              className="absolute inset-0 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"
                              style={{ backgroundColor: rarityColor }}
                            />
                            <img
                              src={skin.image}
                              alt={skin.name}
                              className="w-full h-full object-contain relative z-10"
                            />
                          </div>

                          <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-black text-[#444] uppercase tracking-widest truncate">
                              {type || skin.rarity}
                            </p>
                            <h4 className="text-sm font-black text-[#EAEAEA] truncate">
                              {name}
                            </h4>
                          </div>
                        </div>

                        <div className="bg-[#000]/20 border-t border-[#242424] px-6 py-4 flex items-center justify-between relative z-10">
                          <span className="text-xs font-black text-emerald-500">
                            ${skin.price.toLocaleString()}
                          </span>
                          <span 
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: rarityColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#242424] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={current === 1 || skinsLoading}
                onClick={() => handleFilterChange({ page: current - 1 })}
                className="h-10 w-10 border border-[#242424] rounded-xl flex items-center justify-center text-[#8c8c8c] hover:text-[#EAEAEA] disabled:opacity-30 transition-all font-black"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 px-4 h-10 bg-[#1a1a1a] border border-[#242424] rounded-xl">
                <span className="text-sm font-black text-[#EAEAEA]">{current}</span>
                <span className="text-xs font-bold text-[#444]">of</span>
                <span className="text-sm font-black text-[#8c8c8c]">{totalPages}</span>
              </div>
              <button
                type="button"
                disabled={current === totalPages || skinsLoading}
                onClick={() => handleFilterChange({ page: current + 1 })}
                className="h-10 w-10 border border-[#242424] rounded-xl flex items-center justify-center text-[#8c8c8c] hover:text-[#EAEAEA] disabled:opacity-30 transition-all font-black"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs font-bold text-[#444] uppercase tracking-widest hidden md:block">
              Showing {skins.length} of {total} skins
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="h-12 px-8 text-[#8c8c8c] font-black uppercase text-xs tracking-widest hover:text-[#EAEAEA]"
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              disabled={updateLoading || selectedSkins.length === 0}
              className="h-12 px-10 bg-[#EAEAEA] text-[#141414] hover:bg-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg shadow-white/5 active:scale-95 transition-all"
              type="submit"
            >
              {updateLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Confirm Selection'
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
