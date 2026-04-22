import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Panel } from "./Panel";
import styles from "./Panel.module.css";
import Table from "../components/Table";
import { NavItem } from "../components/NavItem";
import { NavItemModal } from "../components/NavItemModal";
import { DetailHeader } from "../components/PanelHeader";
import { Button, TextButton, IconButton, SplitButton, DownloadButton, CheckboxButton } from '../components/Button';
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

const panelConfigs: PanelConfig[] = [
  { initialWidth: 200, minWidth: 40, maxWidth: 500, collapseWidth: 40, closable: true },
  { initialWidth: 200, minWidth: 60, maxWidth: 900, collapseWidth: 60, gridColumns: 5 },
  { initialWidth: 900, minWidth: 0, maxWidth: 1500, collapseWidth: 50, showHandle: false, fill: true, footer: <div>Footer content</div> },
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

  const leftRows = Array.from({ length: 50 }, (_, i) => `Left item ${i + 1}`);
  const middleRows = Array.from({ length: 50 }, (_, i) => `Middle item ${i + 1}`);
  const rightRows = Array.from({ length: 50 }, (_, i) => `Right item ${i + 1}`);

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
  const navSmall = navResizer < 120;

  return (
    <div className={styles.layout} ref={layoutRef}>
      <Panel
        width={leftWidth}
        minWidth={panelConfigs[0].minWidth}
        collapseWidth={panelConfigs[0].collapseWidth}
        collapsed={leftCollapsed}
        setResizer={setNavResizer}
        closable={panelConfigs[0].closable}
        autoCollapseOnResize={panelConfigs[0].autoCollapseOnResize}
        onToggleCollapse={handleToggleLeftCollapse}
        footer={<>
          <div className="border-t border-gray-700"></div>
          <NavItemModal icon="line-md:account" label="Profile" navSmall={navSmall} />
          <NavItemModal icon="line-md:cog" label="Settings" navSmall={navSmall} />
        </>}
        onResizeStart={() => setResizing(0)}
      >
        <NavItem icon="line-md:home" label="Home" navSmall={navSmall} active badge={3} />
        <NavItem icon="line-md:account" label="Form" navSmall={navSmall} to="form" />
        <NavItem icon="line-md:cog" label="Settings" navSmall={navSmall} />
        <NavItem icon="line-md:file" label="Files" navSmall={navSmall} badge={12} badgeColor="bg-green-500" />
        <NavItem icon="line-md:star" label="Favorites" navSmall={navSmall} />
        <NavItem icon="line-md:account" label="Profile" navSmall={navSmall} />
        <NavItem icon="line-md:cog" label="Settings" navSmall={navSmall} />
        <NavItem icon="line-md:cog" label="Chatbot" navSmall={navSmall} to="chatbot" />
        <NavItem icon="line-md:cog" label="Sections" navSmall={navSmall} to="sections" />
      </Panel>

      <Panel
        width={middleWidth}
        minWidth={panelConfigs[1].minWidth}
        maxWidth={panelConfigs[1].maxWidth}
        setResizer={setTabResizer}
        collapseWidth={panelConfigs[1].collapseWidth}
        gridColumns={panelConfigs[1].gridColumns}
        onResizeStart={() => setResizing(1)}
      >
        <Table tabResizer={tabResizer} />
      </Panel>

      <Panel
        width={rightWidth}
        minWidth={panelConfigs[2].minWidth}
        collapseWidth={panelConfigs[2].collapseWidth}
        showHandle={panelConfigs[2].showHandle}
        fill={panelConfigs[2].fill}
        header={
          <DetailHeader
            icon="line-md:star"
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