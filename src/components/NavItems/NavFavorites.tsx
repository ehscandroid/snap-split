import React from 'react';
import { Icon } from '@iconify/react';

interface FavoriteItem {
  id: number;
  label: string;
  icon: string;
  meta?: string;
}

const FAVORITES: FavoriteItem[] = [
  { id: 1, label: 'Q3 Planning Doc',     icon: 'mdi:file-document-outline', meta: 'Form' },
  { id: 2, label: 'Design System v2',    icon: 'mdi:palette-outline',       meta: 'Buttons' },
  { id: 3, label: 'User Research Notes', icon: 'mdi:note-text-outline',     meta: 'Form' },
  { id: 4, label: 'Sprint Board',        icon: 'mdi:view-column-outline',   meta: 'Home' },
];

export const NavFavorites: React.FC<{ navSmall?: boolean }> = ({ navSmall }) => {
  if (navSmall) {
    return (
      <div className="flex flex-col items-center gap-1 pt-1">
        {FAVORITES.map((item) => (
          <button
            key={item.id}
            title={item.label}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Icon icon={item.icon} width={15} height={15} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {FAVORITES.map((item) => (
        <button
          key={item.id}
          className="flex items-center gap-[11px] px-[11px] py-2 rounded-[9px] text-left transition-colors hover:bg-[#f5f7fa] dark:hover:bg-white/5 group cursor-pointer"
        >
          <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-[#94a3b8]">
            <Icon icon={item.icon} width={16} height={16} />
          </span>
          <span className="flex-1 truncate text-[13.5px] font-medium text-[#334155] dark:text-gray-400 group-hover:text-[#0f172a] dark:group-hover:text-gray-200">{item.label}</span>
          {item.meta && (
            <span className="text-[11px] font-semibold text-[#64748b] dark:text-gray-600 flex-shrink-0">{item.meta}</span>
          )}
        </button>
      ))}
    </div>
  );
};
