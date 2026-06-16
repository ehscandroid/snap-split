import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import './panel-globals.css';

type PanelProps = {
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  collapseWidth?: number;
  collapsed?: boolean;
  closable?: boolean;
  autoCollapseOnResize?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  gridColumns?: number;
  onToggleCollapse?: () => void;
  onResizeStart?: () => void;
  showHandle?: boolean;
  fill?: boolean;
  noTopPadding?: boolean;
  noPadding?: boolean;
  setResizer?: (width: number) => void;
  children: React.ReactNode;
};

export const getPanelWidth = (element: HTMLElement): number => element.offsetWidth;

export const Panel: React.FC<PanelProps> = ({
  width,
  minWidth,
  maxWidth,
  collapseWidth,
  collapsed,
  setResizer,
  closable,
  autoCollapseOnResize = true,
  header,
  footer,
  gridColumns,
  onToggleCollapse,
  onResizeStart,
  showHandle = true,
  fill = undefined,
  noTopPadding = false,
  noPadding = false,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef  = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled]               = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  useEffect(() => {
    if (panelRef.current && setResizer) setResizer(getPanelWidth(panelRef.current));
  }, [width, setResizer]);

  useEffect(() => {
    if (!panelRef.current || !setResizer) return;
    const el = panelRef.current;
    const raf = requestAnimationFrame(() => setResizer(getPanelWidth(el)));
    return () => cancelAnimationFrame(raf);
  }, [internalCollapsed, setResizer]);

  const isControlled        = collapsed !== undefined;
  const isBelowCollapseWidth = collapseWidth !== undefined && width !== undefined && width <= collapseWidth;
  const shouldAutoCollapse  = autoCollapseOnResize && isBelowCollapseWidth;

  const effectiveCollapsed = isControlled
    ? (collapsed || shouldAutoCollapse)
    : (internalCollapsed || isBelowCollapseWidth);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggle = () => {
    if (isControlled) onToggleCollapse?.();
    else setInternalCollapsed(!internalCollapsed);
  };

  const contentPadding = effectiveCollapsed
    ? 'p-0'
    : noPadding
      ? 'p-0'
      : noTopPadding
        ? 'px-4 pb-4'
        : 'p-4';

  return (
    <div
      ref={panelRef}
      className={`panel-item flex flex-col overflow-hidden relative rounded-xl shadow-sm my-4 ml-4
        ${effectiveCollapsed ? 'bg-gray-50 dark:bg-[#2a2a2a]' : 'bg-white dark:bg-[#1e1e1e]'}
        ${fill ? 'flex-1' : ''}
        text-gray-800 dark:text-gray-100`}
      style={{ width: effectiveCollapsed ? collapseWidth : width, minWidth, maxWidth }}
    >
      {/* Header */}
      <div
        className={`flex items-center w-full px-4 min-h-[50px] bg-white dark:bg-[#1f1f1f] sticky top-0 z-[2] transition-shadow duration-200
          ${effectiveCollapsed ? 'justify-center px-0' : ''}`}
        style={{ boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none" }}
      >
        {effectiveCollapsed && closable ? (
          <button onClick={handleToggle} className="flex items-center justify-center w-5 h-5 cursor-pointer bg-transparent border-none text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:plus" width={16} height={16} />
          </button>
        ) : (
          <>
            {header}
            {closable && (
              <button onClick={handleToggle} className="ml-auto flex items-center justify-center w-5 h-5 cursor-pointer bg-transparent border-none text-gray-500 dark:text-gray-400">
                <Icon icon="mdi:minus" width={16} height={16} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className={`panel-scroll flex flex-col gap-1 w-full overflow-auto ${footer ? 'flex-1 min-h-0' : 'flex-1'} ${contentPadding}`}
      >
        {children}
      </div>

      {/* Footer */}
      {footer && !effectiveCollapsed && (
        <div className="flex-shrink-0 min-h-[24px] bg-white dark:bg-[#1e1e1e]">
          {footer}
        </div>
      )}

      {/* Resize handle */}
      {showHandle && (
        <div
          className="panel-handle flex-shrink-0 w-1.5 min-w-[6px] h-[200px] cursor-col-resize bg-transparent hover:bg-gray-400 dark:hover:bg-gray-600 rounded absolute right-0.5 top-1/2 -translate-y-1/2 transition-colors"
          onMouseDown={onResizeStart}
        />
      )}
    </div>
  );
};
