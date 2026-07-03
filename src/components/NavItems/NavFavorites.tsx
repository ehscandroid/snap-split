import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { PackageIcon } from '../icons/PackageIcon';

export const NavFavorites: React.FC<{ navSmall?: boolean }> = ({ navSmall }) => {
  const { favorites } = useFavorites();

  if (navSmall) {
    return (
      <div className="flex flex-col items-center gap-1 pt-1">
        {favorites.map((item) => (
          <Link
            key={item.id}
            to={`/packages?id=${item.id}`}
            title={item.name}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <PackageIcon className="w-[15px] h-[15px]" />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {favorites.map((item) => (
        <Link
          key={item.id}
          to={`/packages?id=${item.id}`}
          className="flex items-center gap-[11px] px-[11px] py-2 rounded-[9px] text-left transition-colors hover:bg-[#f5f7fa] dark:hover:bg-white/5 group cursor-pointer"
        >
          <span className="w-1 h-1 flex-shrink-0 rounded-full bg-[#94a3b8]" />
          <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-[#94a3b8]">
            <PackageIcon className="w-4 h-4" />
          </span>
          <span className="flex-1 truncate text-[13.5px] font-medium text-[#334155] dark:text-gray-400 group-hover:text-[#0f172a] dark:group-hover:text-gray-200">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};
