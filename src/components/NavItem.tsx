import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

interface NavItemProps {
  icon: string;
  label: string;
  to?: string;
  navSmall?: boolean;
  active?: boolean;
  badge?: number;
  badgeColor?: string;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  to,
  navSmall = false,
  active = false,
  badge,
  badgeColor = "bg-gray-100 dark:bg-white/10",
  onClick,
}) => {
  const location = useLocation();
  const isActive = active || (to ? location.pathname === to || location.pathname === `/${to}` : false);

  const className = `
    flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all duration-150 cursor-pointer text-left
    hover:bg-gray-100 hover:text-gray-800
    dark:hover:bg-white/5 dark:hover:text-gray-200
    ${isActive ? '' : 'text-gray-500 dark:text-gray-400'}
    ${navSmall ? "justify-center w-full" : "w-full"}
  `;

  const activeStyle = isActive
    ? { backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)', color: 'var(--accent)' }
    : {};

  const iconEl = (
    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
      <Icon icon={icon} width={16} height={16} />
    </span>
  );

  const content = navSmall ? (
    <div className="relative flex items-center justify-center w-5 h-5">
      {iconEl}
      {badge !== undefined && (
        <span
          className={`absolute -top-1 -right-1.5 min-w-[16px] h-4 flex items-center justify-center px-1 text-[10px] rounded-full ${isActive ? '' : `${badgeColor} text-gray-600 dark:text-gray-300`}`}
          style={isActive ? { backgroundColor: 'color-mix(in srgb, var(--accent) 18%, transparent)', color: 'var(--accent)' } : {}}
        >
          {badge}
        </span>
      )}
    </div>
  ) : (
    <>
      {iconEl}
      <span className="flex-1 truncate text-[13px] font-medium">{label}</span>
      {badge !== undefined && (
        <span
          className={`ml-auto px-2 py-0.5 text-xs rounded-full font-medium ${isActive ? '' : `${badgeColor} text-gray-600 dark:text-gray-300`}`}
          style={isActive ? { backgroundColor: 'color-mix(in srgb, var(--accent) 18%, transparent)', color: 'var(--accent)' } : {}}
        >
          {badge}
        </span>
      )}
    </>
  );

  if (to) {
    return <Link to={to} className={className} style={activeStyle} title={navSmall ? label : undefined}>{content}</Link>;
  }
  return <button onClick={onClick} className={className} style={activeStyle} title={navSmall ? label : undefined}>{content}</button>;
};
