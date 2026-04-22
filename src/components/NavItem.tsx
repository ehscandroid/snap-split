import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

interface NavItemProps {
  icon: string;
  label: string;
  to?: string;
  collapsed?: boolean;
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
  collapsed = false,
  navSmall = false,
  active = false,
  badge,
  badgeColor = "bg-red-500",
  onClick,
}) => {
  const location = useLocation();
  const isCollapsed = collapsed || navSmall;
  const isActive = active || (to ? location.pathname === to : false);

  useEffect(() => {
    console.log(`NavItem "${label}" collapsed state changed: ${collapsed}`);
  }, [collapsed])

  const content = (
    <div className="relative flex items-center justify-center">
      <Icon icon={icon} className="w-5 h-5 flex-shrink-0" />
      {badge !== undefined && isCollapsed && (
        <span className={`absolute -bottom-2 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-xs rounded-full ${badgeColor} text-white`}>
          {badge}
        </span>
      )}
    </div>
  );

  const labelContent = !isCollapsed && (
    <>
      <span className="truncate">{label}</span>
      {badge !== undefined && (
        <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${badgeColor} text-white`}>
          {badge}
        </span>
      )}
    </>
  );

  const className = `
    flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer
    hover:bg-gray-700 hover:text-white
    dark:hover:bg-gray-700 dark:hover:text-white
    ${isActive ? "bg-blue-600 text-white" : "text-gray-400 dark:text-gray-400"}
    ${isCollapsed ? "justify-center w-full" : "w-full"}
  `;

  if (to) {
    return (
      <Link to={to} className={className} title={isCollapsed ? label : undefined}>
        {content}
        {labelContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} title={isCollapsed ? label : undefined}>
      {content}
      {labelContent}
    </button>
  );
};