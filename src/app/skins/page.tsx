'use client';

import {
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import { useListQuery, useDebounce } from '@/lib/hooks';
import { SkinItemType } from '@/schema';

const RARITY_COLORS: Record<string, string> = {
  'Consumer Grade': '#afafaf',
  'Industrial Grade': '#5e98d9',
  'Mil-Spec Grade': '#4b69ff',
  'Mil-Spec': '#4b69ff',
  Restricted: '#8847ff',
  Classified: '#d32ce6',
  Covert: '#eb4b4b',
  Contraband: '#e4ae39',
  Extraordinary: '#e4ae39',
  Rare: '#e4ae39',
  'Base Grade': '#b0c3d9',
  'High Grade': '#4b69ff',
  Remarkable: '#8847ff',
  Exotic: '#d32ce6',
};

export default function SkinsPage() {
  const [q, setQ] = useState('');
  const isFirstRender = useRef(true);
  
  const { data, loading, fetchData, current, totalPages, total } =
    useListQuery<SkinItemType>({
      uri: '/v1/skins',
      enabled: true,
      params: { page: 1, limit: 20 },
    });

  useDebounce(
    (val) => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      fetchData({ name: val, page: 1 });
    },
    500,
    q,
  );

  const handleSearch = (val: string) => {
    setQ(val);
  };

  const getSkinRarity = (skin: any) => {
    const typeStr = skin.type || skin.base_name || '';
    for (const rarity in RARITY_COLORS) {
      if (typeStr.includes(rarity)) {
        return rarity;
      }
    }
    return skin.rarity || 'Common';
  };

  const getSkinExterior = (skin: any) => {
    if (skin.exterior && skin.exterior !== 'Not Painted') {
      return skin.exterior;
    }
    const match = skin.marketHashName?.match(/\(([^)]+)\)$/);
    return match ? match[1] : skin.exterior || '---';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Skins' }]} />

      <main className="flex-1 p-8 pt-[100px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#EAEAEA]">Skin Inventory</h2>
            <p className="text-sm text-[#8c8c8c] mt-1">
              Browse the global skins database.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">
              Total Skins
            </p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">
              {loading ? '...' : total.toLocaleString()}
            </h4>
          </div>
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">
              Database Count
            </p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">
              {loading ? '...' : total.toLocaleString()}
            </h4>
          </div>
          <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] p-6">
            <p className="text-xs font-bold text-[#8c8c8c] uppercase mb-1">
              Sync Status
            </p>
            <h4 className="text-2xl font-bold text-[#EAEAEA]">Healthy</h4>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8c8c]" />
            <input
              type="text"
              placeholder="Search skins by name..."
              value={q}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-11 bg-[#1a1a1a] border border-[#242424] rounded-[12px] pl-10 pr-4 text-sm text-[#EAEAEA] focus:outline-none focus:border-[#3E3E3E] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 h-11 px-4 bg-[#1a1a1a] border border-[#242424] rounded-[12px] text-sm font-semibold text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="bg-[#1a1a1a] border border-[#242424] rounded-[18px] overflow-hidden min-h-[400px] flex flex-col">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#242424]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Skin
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Rarity
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider">
                    Exterior
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#8c8c8c] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 text-[#EAEAEA] animate-spin" />
                        <p className="text-sm text-[#8c8c8c]">
                          Loading skins...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <p className="text-sm text-[#8c8c8c]">No skins found</p>
                    </td>
                  </tr>
                ) : (
                  data.map((skin: any) => {
                    const rarity = getSkinRarity(skin);
                    const rarityColor = RARITY_COLORS[rarity] || '#ffffff';
                    const exterior = getSkinExterior(skin);
                    
                    return (
                      <tr
                        key={skin.id}
                        className="hover:bg-[#202020] transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-[#242424] border border-[#3E3E3E] flex items-center justify-center p-1 overflow-hidden">
                              <img
                                src={skin.image}
                                alt={skin.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#EAEAEA]">
                                {skin.name}
                              </p>
                              <p className="text-[10px] text-[#8c8c8c] uppercase font-bold tracking-tight">
                                {skin.type}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                            style={{
                              backgroundColor: `${rarityColor}15`,
                              color: rarityColor,
                            }}
                          >
                            {rarity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-[#EAEAEA]">
                            ${skin.price?.toLocaleString() || '0.00'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-semibold text-[#8c8c8c]">
                            {exterior}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-[#292929] rounded-lg text-[#8c8c8c] hover:text-[#EAEAEA] transition-colors">
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && data.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#242424] bg-[#1a1a1a]">
              <p className="text-xs text-[#8c8c8c]">
                Showing {data.length} of {total.toLocaleString()} skins
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={current === 1}
                  onClick={() => fetchData({ name: q, page: current - 1 })}
                  className="p-1 text-[#8c8c8c] disabled:opacity-30 hover:text-[#EAEAEA] transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-1 mx-2">
                  <span className="text-xs font-bold text-[#EAEAEA] px-2 py-1 bg-[#242424] rounded-md border border-[#3E3E3E]">
                    {current}
                  </span>
                  <span className="text-xs text-[#8c8c8c]">/</span>
                  <span className="text-xs font-bold text-[#8c8c8c] px-1">
                    {totalPages}
                  </span>
                </div>
                <button
                  disabled={current === totalPages}
                  onClick={() => fetchData({ name: q, page: current + 1 })}
                  className="p-1 text-[#8c8c8c] disabled:opacity-30 hover:text-[#EAEAEA] transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
