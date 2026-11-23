import React from 'react';
import { InventoryItem } from '../../../models/nsvModels';

interface InventoryListProps {
  items: InventoryItem[];
}

export const InventoryList: React.FC<InventoryListProps> = ({ items = [] }) => {
  const getConditionBadge = (cond: InventoryItem['condition']) => {
    switch (cond) {
      case 'Good':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Good</span>;
      case 'Fair':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Fair</span>;
      case 'Damaged':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">Damaged</span>;
      case 'Missing':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Missing</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
        <h4 className="font-bold text-slate-900 text-sm">Road Inventory</h4>
        <span className="text-xs text-slate-500 font-medium tabular-nums">{items.length} Items</span>
      </div>

      <div className="divide-y divide-slate-100 text-xs">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{item.name}</span>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {item.category}
                </span>
              </div>
              <p className="text-slate-500">{item.details}</p>
              <span className="text-[11px] text-slate-400 block tabular-nums">Location: {item.chainageLocation}</span>
            </div>

            <div className="flex-shrink-0">
              {getConditionBadge(item.condition)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
