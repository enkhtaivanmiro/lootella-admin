'use client';

import { useParams } from 'next/navigation';
import { Settings, Percent, Search, Box, Loader2 } from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useQuery } from '@/lib/hooks';
import { CaseDetailResponseType, CaseItemType } from '@/schema';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const RARITY_COLORS: Record<string, string> = {
  'Consumer Grade': '#afafaf',
  'Industrial Grade': '#5e98d9',
  'Mil-Spec': '#4b69ff',
  Restricted: '#8847ff',
  Classified: '#d32ee6',
  Covert: '#eb4b4b',
  Contraband: '#e4ae39',
  Extraordinary: '#e4ae39',
  Rare: '#e4ae39',
};

const RARITY_BG: Record<string, string> = {
  'Consumer Grade': 'rgba(175, 175, 175, 0.1)',
  'Industrial Grade': 'rgba(94, 152, 217, 0.1)',
  'Mil-Spec': 'rgba(75, 105, 255, 0.1)',
  Restricted: 'rgba(136, 71, 255, 0.1)',
  Classified: 'rgba(211, 46, 230, 0.1)',
  Covert: 'rgba(235, 75, 75, 0.1)',
  Contraband: 'rgba(228, 174, 57, 0.1)',
  Extraordinary: 'rgba(228, 174, 57, 0.1)',
  Rare: 'rgba(228, 174, 57, 0.1)',
};

export default function CaseDetailPage() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, error } = useQuery<CaseDetailResponseType>({
    uri: `/v1/cases/${slug}`,
    enabled: !!slug,
  });

  const containers = data?.containers || [];
  const currentContainer = containers[activeTab];

  const groupedItems = useMemo(() => {
    if (!currentContainer) return [];

    const groups: Record<string, CaseItemType[]> = {};
    currentContainer.items.forEach((item) => {
      if (!groups[item.name]) {
        groups[item.name] = [];
      }
      groups[item.name].push(item);
    });

    return Object.entries(groups).map(([name, variants]) => {
      const sortedVariants = [...variants].sort((a, b) => b.value - a.value);
      return {
        ...sortedVariants[0],
        variants: sortedVariants,
        minPrice: Math.min(...variants.map((v) => v.value)),
        maxPrice: Math.max(...variants.map((v) => v.value)),
        totalTickets: variants.reduce((acc, v) => acc + v.tickets, 0),
      };
    });
  }, [currentContainer]);

  const filteredItems = useMemo(() => {
    return groupedItems.filter((group) => {
      const query = searchQuery.toLowerCase();
      if (group.name.toLowerCase().includes(query)) return true;
      if (group.rarity.toLowerCase().includes(query)) return true;
      return group.variants.some((v: { hashName: string }) =>
        v.hashName.toLowerCase().includes(query),
      );
    });
  }, [groupedItems, searchQuery]);

  const getWearLabel = (hashName: string) => {
    const match = hashName.match(/\(([^)]+)\)$/);
    return match ? match[1] : 'Default';
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cases', href: '/cases' },
            { label: 'Loading...' },
          ]}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-[#EAEAEA] animate-spin" />
            <p className="text-[#8c8c8c] font-medium">Fetching case data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentContainer) {
    return (
      <div className="flex flex-col min-h-screen">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cases', href: '/cases' },
            { label: 'Error' },
          ]}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-bold text-[#EAEAEA] mb-2">
              Failed to load case
            </h3>
            <p className="text-[#8c8c8c] mb-6">
              The case you are looking for might have been removed or renamed.
            </p>
            <Link href="/cases">
              <button className="px-6 py-2 bg-[#EAEAEA] text-[#141414] rounded-lg font-bold hover:bg-white transition-colors">
                Back to Cases
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cases', href: '/cases' },
          { label: currentContainer.name },
        ]}
      />

      <main className="flex-1 p-8 pt-[100px] max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div className="flex items-start gap-8">
            <div className="h-40 w-40 rounded-[24px] bg-[#1a1a1a] border border-[#242424] flex items-center justify-center p-4 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src={currentContainer.image}
                alt={currentContainer.name}
                className="h-full w-full object-contain relative z-10"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-emerald-500/20">
                  {currentContainer.category}
                </span>
                <span className="text-xs font-bold text-[#8c8c8c] uppercase tracking-widest flex items-center gap-1.5">
                  <Box className="h-3 w-3" />
                  ID: {currentContainer.id.slice(0, 8)}
                </span>
              </div>
              <h1 className="text-4xl font-black text-[#EAEAEA] mb-4 tracking-tight leading-none">
                {currentContainer.name}
              </h1>
              <div className="flex border-b border-[#242424] w-full md:w-auto overflow-x-auto no-scrollbar">
                {containers.map((container, idx) => (
                  <button
                    key={container.id}
                    onClick={() => setActiveTab(idx)}
                    className={cn(
                      'px-8 py-4 text-sm font-bold transition-all relative min-w-max',
                      activeTab === idx
                        ? 'text-[#EAEAEA]'
                        : 'text-[#8c8c8c] hover:text-[#EAEAEA]',
                    )}
                  >
                    {container.name.includes('Boosted')
                      ? 'Boosted Mode'
                      : container.name.includes('Jester')
                        ? 'Jester Mode'
                        : 'Regular Mode'}
                    {activeTab === idx && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-[#242424] rounded-[14px] text-sm font-bold text-[#8c8c8c] hover:text-[#EAEAEA] hover:border-[#3E3E3E] transition-all">
              <Settings className="h-4 w-4" />
              Edit Case
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#EAEAEA] rounded-[14px] text-sm font-bold text-[#141414] hover:bg-white transition-all shadow-lg shadow-white/5">
              <Percent className="h-4 w-4" />
              Manage Odds
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] font-bold text-[#8c8c8c] uppercase tracking-widest mb-1">
                Current Price
              </p>
              <p className="text-2xl font-black text-[#EAEAEA]">
                {currentContainer.price === 0
                  ? 'FREE'
                  : `$${currentContainer.price.toLocaleString()}`}
              </p>
            </div>
            <div className="w-[1px] h-10 bg-[#242424]" />
            <div>
              <p className="text-[10px] font-bold text-[#8c8c8c] uppercase tracking-widest mb-1">
                Total Items
              </p>
              <p className="text-2xl font-black text-[#EAEAEA]">
                {currentContainer.items.length}
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8c8c]" />
            <input
              type="text"
              placeholder="Search items by name or rarity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-[#1a1a1a] border border-[#242424] rounded-[16px] pl-11 pr-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {filteredItems.map((group: any) => {
            const rarityColor = RARITY_COLORS[group.rarity] || '#ffffff';
            const rarityBg =
              RARITY_BG[group.rarity] || 'rgba(255, 255, 255, 0.05)';

            return (
              <div
                key={group.id}
                className="group bg-[#1a1a1a] border border-[#242424] rounded-[24px] p-5 hover:border-[#3E3E3E] hover:-translate-y-1 transition-all flex flex-col items-center text-center relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: rarityColor }}
                />

                <div
                  className="h-32 w-full mb-4 flex items-center justify-center p-2 rounded-2xl transition-colors"
                  style={{ backgroundColor: rarityBg }}
                >
                  <img
                    src={group.image}
                    alt={group.name}
                    className="h-full w-full object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="w-full">
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.15em] mb-1.5"
                    style={{ color: rarityColor }}
                  >
                    {group.rarity}
                  </p>
                  <h4 className="text-sm font-bold text-[#EAEAEA] line-clamp-2 mb-3 h-10 leading-snug">
                    {group.name}
                  </h4>

                  <div className="pt-3 border-t border-[#242424] flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-[#8c8c8c] uppercase tracking-wider mb-0.5 text-left">
                        {group.variants.length > 1 ? 'Price Range' : 'Value'}
                      </p>
                      <p className="text-xs font-black text-[#EAEAEA] text-left">
                        {group.minPrice === group.maxPrice
                          ? `$${group.minPrice.toFixed(2)}`
                          : `$${group.minPrice.toFixed(2)} - $${group.maxPrice.toFixed(2)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#8c8c8c] uppercase tracking-wider mb-0.5 text-right">
                        {group.variants.length > 1 ? 'Total Odds' : 'Odds'}
                      </p>
                      <p className="text-xs font-black text-[#EAEAEA] text-right">
                        {((group.totalTickets / 100000) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-5">
                  <div className="w-full flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar scroll-smooth">
                    {group.variants.map((variant: any) => (
                      <button
                        key={variant.id}
                        className="w-full px-4 py-2.5 bg-[#242424]/50 hover:bg-[#EAEAEA] rounded-[14px] text-left flex items-center justify-between group/variant transition-all hover:scale-[1.02] border border-transparent hover:border-white/10"
                      >
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#EAEAEA] group-hover/variant:text-[#141414] transition-colors">
                            {getWearLabel(variant.hashName)}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-emerald-500 group-hover/variant:text-[#141414] transition-colors">
                            ${variant.value.toFixed(2)}
                          </span>
                          <span className="text-[8px] font-bold text-[#8c8c8c] group-hover/variant:text-[#242424]/60 transition-colors">
                            {((variant.tickets / 100000) * 100).toFixed(2)}%
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center border border-[#242424] border-dashed rounded-[32px]">
            <Search className="h-12 w-12 text-[#242424] mb-4" />
            <p className="text-[#8c8c8c] font-bold text-lg">
              No items matching your search
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
