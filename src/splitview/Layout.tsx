import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Outlet, useLocation } from "react-router-dom";
import { Panel } from "./Panel";
import Table from "../components/Table";
import { NavItem } from "../components/NavItem";
import { NavFavorites } from "../components/NavFavorites";
import { NavItemModal } from "../components/NavItemModal";
import { DetailHeader } from "../components/PanelHeader";
import { SplitButton } from '../components/Button';
import { FlagIcon } from "../components/FlagIcon";

type PanelConfig = {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  collapseWidth: number;
  showHandle?: boolean;
  fill?: boolean;
  closable?: boolean;
  autoCollapseOnResize?: boolean;
  footer?: React.ReactNode;
  gridColumns?: number;
};

const STORAGE_KEYS = {
  leftWidth: 'panel-left-width',
  middleWidth: 'panel-middle-width',
  rightWidth: 'panel-right-width',
};

const getStoredWidth = (key: string, defaultValue: number): number => {
  const stored = localStorage.getItem(key);
  return stored ? parseInt(stored, 10) : defaultValue;
};

const COLLAPSE_WIDTH = parseInt(import.meta.env.VITE_PANEL_COLLAPSE_WIDTH) || 40;

const panelConfigs: PanelConfig[] = [
  { initialWidth: 200, minWidth: COLLAPSE_WIDTH, maxWidth: 500, collapseWidth: COLLAPSE_WIDTH, closable: true },
  { initialWidth: 200, minWidth: COLLAPSE_WIDTH, maxWidth: 900, collapseWidth: COLLAPSE_WIDTH, gridColumns: 5 },
  { initialWidth: 900, minWidth: 0, maxWidth: 1500, collapseWidth: 50, showHandle: false, fill: true, footer: <></> },
];

const Layout: React.FC = () => {
  const [resizing, setResizing] = useState<number | null>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  const [leftWidth, setLeftWidth] = useState(() => getStoredWidth(STORAGE_KEYS.leftWidth, panelConfigs[0].initialWidth));
  const [middleWidth, setMiddleWidth] = useState(() => getStoredWidth(STORAGE_KEYS.middleWidth, panelConfigs[1].initialWidth));
  const [rightWidth, setRightWidth] = useState(() => getStoredWidth(STORAGE_KEYS.rightWidth, panelConfigs[2].initialWidth));
  const [leftCollapsed, setLeftCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.leftWidth, leftWidth.toString());
  }, [leftWidth]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.middleWidth, middleWidth.toString());
  }, [middleWidth]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.rightWidth, rightWidth.toString());
  }, [rightWidth]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (resizing === null || !layoutRef.current) return;

      const dx = e.movementX;
      const maxWidth = panelConfigs[resizing].maxWidth;

      if (resizing === 0) {
        setLeftWidth((w) => Math.min(maxWidth, Math.max(0, w + dx)));
      } else if (resizing === 1) {
        setMiddleWidth((w) => Math.min(maxWidth, Math.max(0, w + dx)));
      } else if (resizing === 2) {
        setRightWidth((w) => Math.max(0, w - dx));
      }
    };

    const onUp = () => setResizing(null);

    if (resizing !== null) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [resizing]);

  const handleToggleLeftCollapse = () => {
    if (leftCollapsed) {
      setLeftWidth(panelConfigs[0].initialWidth);
      setLeftCollapsed(false);
    } else {
      setLeftWidth(panelConfigs[0].collapseWidth);
      setLeftCollapsed(true);
    }
  };

  const [navResizer, setNavResizer] = useState(200);
  const [tabResizer, setTabResizer] = useState(200);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const navSmall = navResizer < 120;
  const location = useLocation();
  const isFullView = location.pathname === '/fullview';

  return (
    <div className="panel-layout flex h-screen w-screen bg-gray-100 dark:bg-[#111] p-[5px] gap-[5px] pr-5" ref={layoutRef}>
      <Panel
        width={leftWidth}
        minWidth={panelConfigs[0].minWidth}
        collapseWidth={panelConfigs[0].collapseWidth}
        collapsed={leftCollapsed}
        setResizer={setNavResizer}
        closable={panelConfigs[0].closable}
        autoCollapseOnResize={panelConfigs[0].autoCollapseOnResize}
        onToggleCollapse={handleToggleLeftCollapse}
        header={
          navSmall
            ? <Icon icon="mdi:view-split-vertical" className="w-5 h-5 text-gray-400 mx-auto" />
            : <div className="flex items-center gap-2">
                <Icon icon="mdi:view-split-vertical" className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="font-semibold text-gray-800 dark:text-gray-100 tracking-tight truncate">Snap-Split</span>
              </div>
        }
        footer={<>
          <NavItemModal icon="mdi:account-outline" label="Profile" navSmall={navSmall} />
          <NavItemModal icon="mdi:cog-outline" label="Settings" navSmall={navSmall} />
        </>}
        onResizeStart={() => setResizing(0)}
      >
        <NavItem icon="mdi:home-outline" label="Home" navSmall={navSmall} to="/" />
        <NavItem icon="mdi:form-select" label="Form" navSmall={navSmall} to="form" />
        <NavItem icon="mdi:button-cursor" label="Buttons" navSmall={navSmall} to="buttons" />
        <NavItem icon="mdi:fullscreen" label="Full View" navSmall={navSmall} to="fullview" />
        <NavFavorites navSmall={navSmall} />
      </Panel>

      {!isFullView && <Panel
        width={middleWidth}
        minWidth={panelConfigs[1].minWidth}
        maxWidth={panelConfigs[1].maxWidth}
        setResizer={setTabResizer}
        collapseWidth={panelConfigs[1].collapseWidth}
        gridColumns={panelConfigs[1].gridColumns}
        onResizeStart={() => setResizing(1)}
        closable
        noPadding
        header={
          <div className="flex items-center gap-2 w-full">
            <span className="font-semibold text-gray-800 dark:text-gray-100">Items</span>
            <button
              onClick={() => setColumnsOpen(true)}
              className="ml-auto mr-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-150"
            >
              <Icon icon="mdi:table-column" width={14} height={14} />
              Columns
            </button>
          </div>
        }
      >
        <Table tabResizer={tabResizer} columnsOpen={columnsOpen} onColumnsClose={() => setColumnsOpen(false)} />
      </Panel>}

      <Panel
        width={rightWidth}
        minWidth={panelConfigs[2].minWidth}
        collapseWidth={panelConfigs[2].collapseWidth}
        showHandle={panelConfigs[2].showHandle}
        fill={panelConfigs[2].fill}
        header={
          <DetailHeader
            icon="mdi:star-outline"
            title="Form Elements"
            subtitle="Additional information and details about Form Elements and Buttons"
            trailing={<FlagIcon
              countryCode="de"
              className="text-2xl rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
            />}
            buttonRow={<>
              <div className="flex flex-wrap gap-4">
                <SplitButton
                  label="Save"
                  variant="primary"
                  options={[
                    { label: 'Save as Draft', icon: '📝', onClick: () => console.log('Save as Draft') },
                    { label: 'Save & Publish', icon: '🚀', onClick: () => console.log('Save & Publish') },
                    { label: 'Save & Close', icon: '✖️', onClick: () => console.log('Save & Close') },
                  ]}
                  onClick={() => console.log('Save clicked')}
                />
                <SplitButton
                  label="Export"
                  variant="secondary"
                  options={[
                    { label: 'Export as PDF', icon: '📕', onClick: () => console.log('Export PDF') },
                    { label: 'Export as CSV', icon: '📊', onClick: () => console.log('Export CSV') },
                  ]}
                  onClick={() => console.log('Export clicked')}
                />
                <SplitButton
                  label="Delete"
                  variant="danger"
                  options={[
                    { label: 'Delete All', onClick: () => console.log('Delete All') },
                    { label: 'Delete Selected', onClick: () => console.log('Delete Selected') },
                  ]}
                  onClick={() => console.log('Delete clicked')}
                />
              </div>
            </>}
            tag="something" />}
        footer={panelConfigs[2].footer}
        onResizeStart={() => setResizing(2)}
      >
        <Outlet />
      </Panel>
    </div>
  );
};

export default Layout;
