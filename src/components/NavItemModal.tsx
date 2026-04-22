import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeContext";

interface NavItemModalProps {
  icon: string;
  label: string;
  modalContent?: React.ReactNode;
  collapsed?: boolean;
  navSmall?: boolean;
  active?: boolean;
  badge?: number;
  badgeColor?: string;
}

export const NavItemModal: React.FC<NavItemModalProps> = ({
  icon,
  label,
  modalContent,
  collapsed = false,
  navSmall = false,
  active = false,
  badge,
  badgeColor = "bg-red-500",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isCollapsed = collapsed || navSmall;

  const renderModalContent = () => {
    if (label === "Settings" && !modalContent) {
      return (
        <div className="flex items-center justify-between">
          <span className="text-gray-100">Dark Mode</span>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === "dark" ? "bg-blue-600" : "bg-gray-400"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>
      );
    }
    return modalContent;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`
          flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer
          hover:bg-gray-700 hover:text-white
          dark:hover:bg-gray-700 dark:hover:text-white
          ${active ? "bg-blue-600 text-white" : "text-gray-400 dark:text-gray-400"}
          ${isCollapsed ? "justify-center w-full" : "w-full"}
        `}
        title={isCollapsed ? label : undefined}
      >
        <div className="relative flex items-center justify-center">
          <Icon icon={icon} className="w-5 h-5 flex-shrink-0" />
          {badge !== undefined && isCollapsed && (
            <span className={`absolute -top-0.5 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-xs rounded-full ${badgeColor} text-white`}>
              {badge}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <>
            <span className="truncate">{label}</span>
            {badge !== undefined && (
              <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${badgeColor} text-white`}>
                {badge}
              </span>
            )}
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-gray-800 dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-100">{label}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <Icon icon="line-md:close" className="w-5 h-5" />
              </button>
            </div>
            <div className="text-gray-300">{renderModalContent()}</div>
          </div>
        </div>
      )}
    </>
  );
};