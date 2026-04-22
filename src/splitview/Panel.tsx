import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import lineMdMinus from "@iconify-icons/line-md/minus";
import lineMdPlus from "@iconify-icons/line-md/plus";
import styles from "./Panel.module.css";

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
  setResizer?: (width: number) => void;
  children: React.ReactNode;
};

export const getPanelWidth = (element: HTMLElement): number => {
  return element.offsetWidth;
};

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
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  useEffect(() => {
    if (panelRef.current && setResizer) {
      setResizer(getPanelWidth(panelRef.current));
    }
  }, [width, setResizer]);

  const isControlled = collapsed !== undefined;
  const isBelowCollapseWidth = collapseWidth !== undefined && width !== undefined && width <= collapseWidth;
  const shouldAutoCollapse = autoCollapseOnResize && isBelowCollapseWidth;
  
  let effectiveCollapsed: boolean;
  if (isControlled) {
    effectiveCollapsed = collapsed || shouldAutoCollapse;
  } else {
    effectiveCollapsed = internalCollapsed || isBelowCollapseWidth;
  }

  const currentColumns = React.useMemo(() => {
    if (!gridColumns || !width || !maxWidth) return undefined;
    const colWidth = maxWidth / gridColumns;
    const visibleCols = Math.max(1, Math.floor(width / colWidth));
    console.log(visibleCols)
    return visibleCols;
  }, [gridColumns, width, maxWidth]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      setScrolled(el.scrollTop > 0);
    };

    el.addEventListener("scroll", onScroll);
    onScroll();

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggle = () => {
    if (isControlled) {
      onToggleCollapse?.();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  return (
    <div
      ref={panelRef}
      className={`${styles.panel} ${fill ? styles.panelFill : ""} ${effectiveCollapsed ? styles.panelCollapsed : ""}`}
      style={{ width: effectiveCollapsed ? collapseWidth : width, minWidth, maxWidth }}
    >
      <div
        className={`${styles.panelInsideHeader} ${effectiveCollapsed ? styles.panelInsideContentCollapsed : ""}`}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
            transition: "box-shadow 0.2s ease",
          }}
      >
        {effectiveCollapsed && closable ? (
          <button onClick={handleToggle} style={{ margin: "0 auto", cursor: "pointer", background: "none", border: "none", display: "flex" }}>
            <Icon icon={lineMdPlus} />
          </button>
        ) : (
          <>
            {header || ` <span>Header</span>`}
            {closable && (
              <button onClick={handleToggle} style={{ marginLeft: "auto", cursor: "pointer", background: "none", border: "none", display: "flex" }}>
                <Icon icon={lineMdMinus} />
              </button>
            )}
          </>
        )}
      </div>


        <>
          <div
            ref={scrollRef}
            className={`${styles.panelInsideContent} ${effectiveCollapsed ? styles.panelInsideContentCollapsed : ""}`}
            style={{
              overflow: "auto",
              flex: footer ? "1" : undefined,
              minHeight: footer ? "0" : undefined,
            }}
          >
            {children}
          </div>
          {footer && <div className={`${styles.panelInsideFooter} ${effectiveCollapsed ? styles.panelInsideContentCollapsed : ""}`}>{footer}</div>}
        </>

      {showHandle && (
        <div className={styles.handle} onMouseDown={onResizeStart} />
      )}
    </div>
  );
};