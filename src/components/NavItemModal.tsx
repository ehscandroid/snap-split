import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeContext";
import { useAccent, ACCENT_COLORS } from "../context/AccentContext";

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
  const { accent, setAccent } = useAccent();

  const isCollapsed = collapsed || navSmall;

  const renderModalContent = () => {
    if (label === "Settings" && !modalContent) {
      return (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Dark Mode</span>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === "dark" ? "bg-blue-600" : "bg-gray-400"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Accent Color</span>
            <div className="flex gap-2 flex-wrap">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.id}
                  title={color.label}
                  onClick={() => setAccent(color)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: color.value }}
                >
                  {accent.id === color.id && (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
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
          flex items-center gap-3 p-3 rounded-lg transition-all duration-150 cursor-pointer text-left
          hover:bg-gray-100 hover:text-gray-800
          dark:hover:bg-white/5 dark:hover:text-gray-200
          ${active
            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400"}
          ${isCollapsed ? "justify-center w-full" : "w-full"}
        `}
        title={isCollapsed ? label : undefined}
      >
        <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
          <Icon icon={icon} width={20} height={20} />
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
                <Icon icon="mdi:close" className="w-5 h-5" />
              </button>
            </div>
            <div className="text-gray-300">{renderModalContent()}</div>
          </div>
        </div>
      )}
    </>
  );
};