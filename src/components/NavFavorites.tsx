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
      <div className="px-2 pt-3 pb-2">
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">Favorites</span>
      </div>
      {FAVORITES.map((item) => (
        <button
          key={item.id}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5 group"
        >
          <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">
            <Icon icon={item.icon} width={14} height={14} />
          </span>
          <span className="flex-1 truncate text-[13px] font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">{item.label}</span>
          {item.meta && (
            <span className="text-[10px] text-gray-300 dark:text-gray-600 flex-shrink-0">{item.meta}</span>
          )}
        </button>
      ))}
    </div>
  );
};
