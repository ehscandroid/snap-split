import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { Panel } from "./Panel";
import Table from "../components/Table";
import SdsTable from "../components/SdsTable";
import SdsEditModal from "../components/SdsEditModal";
import PackagePickerModal from "../components/PackagePickerModal";
import { Chip } from "../components/Chip/Chip";
import { NavItem } from "../components/NavItems/NavItem";
import { NavFavorites } from "../components/NavItems/NavFavorites";
import { NavItemModal } from "../components/NavItems/NavItemModal";
import { PackageIcon } from "../components/icons/PackageIcon";
import { SdsIcon } from "../components/icons/SdsIcon";
import { DetailHeader } from "../components/PanelHeader";
import { SplitButton } from '../components/Button';
import { FlagIcon } from "../components/FlagIcon";
import ToastSimple from "../components/ToastSimple";
import NavDivider from "../components/NavItems/NavDivider";
import { useStateStore } from 'mgsmu-react'

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
const LEFT_MAX   = parseInt(import.meta.env.VITE_PANEL_LEFT_MAX_WIDTH)   || 500;
const MIDDLE_MAX = parseInt(import.meta.env.VITE_PANEL_MIDDLE_MAX_WIDTH) || 900;
const RIGHT_MAX  = parseInt(import.meta.env.VITE_PANEL_RIGHT_MAX_WIDTH)  || 1500;

const panelConfigs: PanelConfig[] = [
  { initialWidth: 200, minWidth: COLLAPSE_WIDTH, maxWidth: LEFT_MAX,   collapseWidth: COLLAPSE_WIDTH, closable: true },
  { initialWidth: 200, minWidth: COLLAPSE_WIDTH, maxWidth: MIDDLE_MAX, collapseWidth: COLLAPSE_WIDTH, gridColumns: 5 },
  { initialWidth: 900, minWidth: 0,              maxWidth: RIGHT_MAX,  collapseWidth: 50, showHandle: false, fill: true, footer: <></> },
];

const Layout: React.FC = () => {
  const [_, toastClick] = useStateStore('toastEdit');
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
  const [detailResizer, setDetailResizer] = useState(900);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersTab, setFiltersTab] = useState(0);
  const [sdsSelected, setSdsSelected] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [packagePickerOpen, setPackagePickerOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const sdsSearch = searchParams.get('search') ?? '';
  const packageTag = searchParams.get('package');

  const setSdsSearch = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      value ? next.set('search', value) : next.delete('search');
      return next;
    });
  };

  const removePackageTag = () => {
    setSearchParams(new URLSearchParams());
  };

  const selectPackageTag = (name: string) => {
    const next = new URLSearchParams();
    next.set('package', name);
    setSearchParams(next);
    setPackagePickerOpen(false);
  };

  const openFilters = (tab: number) => { setFiltersTab(tab); setFiltersOpen(true) }
  const navSmall = navResizer < 120;
  const location = useLocation();
  const isFullView = location.pathname === '/fullview';
  const isSds = location.pathname === '/sds';
  const isTenants = location.pathname === '/tenants';
  const isStatuses = location.pathname === '/statuses';
  const isChips = location.pathname === '/chips';
  const isPackages = location.pathname === '/packages';

  return (
    <div className="panel-layout flex h-screen w-screen bg-[#eaedf1] dark:bg-[#111] p-4 gap-4" ref={layoutRef}>
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
                <span className="text-[16px] font-bold text-[#0f172a] dark:text-gray-100 tracking-[-0.01em] truncate">Snap-Split</span>
                <button onClick={() => toastClick({open: true})} className="ml-auto mr-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-150">
                  <Icon icon="mdi:bell" width={14} height={14} />
                  Toast
                </button>
              </div>
        }
        footer={<>
          <NavItemModal icon="mdi:account-outline" label="Profile" navSmall={navSmall} />
          <NavItemModal icon="mdi:cog-outline" label="Settings" navSmall={navSmall} />
        </>}
        onResizeStart={() => setResizing(0)}
      >
        <NavItem icon="mdi:file-document-outline" iconNode={<SdsIcon className="w-[18px] h-[18px]" />} label="SDS" navSmall={navSmall} to="sds" />
        <NavItem icon="mdi:package-variant-closed" iconNode={<PackageIcon className="w-[18px] h-[18px]" />} label="Packages" navSmall={navSmall} to="packages" />
        <NavItem icon="mdi:domain" label="Tenants" navSmall={navSmall} to="tenants" />
        <NavDivider title="Components" />       
        <NavItem icon="mdi:home-outline" label="Home" navSmall={navSmall} to="/" />
        <NavItem icon="mdi:list-status" label="Statuses" navSmall={navSmall} to="statuses" />
        <NavItem icon="mdi:shape-outline" label="Chips" navSmall={navSmall} to="chips" />
        <NavItem icon="mdi:form-select" label="Form" navSmall={navSmall} to="form" />
        <NavItem icon="mdi:button-cursor" label="Buttons" navSmall={navSmall} to="buttons" />
        <NavItem icon="mdi:fullscreen" label="Full View" navSmall={navSmall} to="fullview" />
        <NavDivider title="Favorites" />  
        <NavFavorites navSmall={navSmall} />
      </Panel>

      {!isFullView && !isTenants && !isStatuses && !isChips && !isPackages && <Panel
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
          isSds ? (
            <div className="flex items-center gap-2 w-full mr-2">
              <div className="flex-1 flex items-center flex-wrap gap-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 focus-within:border-gray-300 dark:focus-within:border-white/20 transition-colors">
                {/* <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg> */}
                {packageTag && (
                  <Chip iconNode={<PackageIcon className="w-3.5 h-3.5" />} label={packageTag} onClick={() => setPackagePickerOpen(true)} />
                )}
                {!packageTag && (
                  <button
                    onClick={() => setPackagePickerOpen(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 border border-dashed border-gray-300 dark:border-white/15"
                  >
                    + Package
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Search SDS"
                  value={sdsSearch}
                  onChange={(e) => setSdsSearch(e.target.value)}
                  className="flex-1 min-w-[60px] bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                />
                {sdsSearch && (
                  <svg className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={() => setSdsSearch('')}>
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                )}
                <button onClick={() => openFilters(0)} className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                  <Icon icon="mdi:tune-variant" width={16} height={16} />
                </button>
              </div>
              {sdsSelected > 0 && (
                <button onClick={() => setEditOpen(true)} className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-white transition-colors" style={{ backgroundColor: 'var(--accent)' }}>
                  <Icon icon="mdi:pencil-outline" width={14} height={14} />
                  Edit ({sdsSelected})
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <span className="text-[17px] font-bold text-[#0f172a] dark:text-gray-100 tracking-[-0.01em]">Items</span>
              <button
                onClick={() => setColumnsOpen(true)}
                className="ml-auto mr-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-150"
              >
                <Icon icon="mdi:table-column" width={14} height={14} />
                Columns
              </button>
            </div>
          )
        }
      >
        {isSds
          ? <SdsTable tabResizer={tabResizer} filtersOpen={filtersOpen} filtersTab={filtersTab} onFiltersClose={() => setFiltersOpen(false)} onSelectionChange={setSdsSelected} />
          : <Table tabResizer={tabResizer} columnsOpen={columnsOpen} onColumnsClose={() => setColumnsOpen(false)} />
        }
      </Panel>}

      {(isTenants || isStatuses || isChips || isPackages) && (
        <Panel fill noPadding showHandle={false}>
          <Outlet />
        </Panel>
      )}

      {!isTenants && !isStatuses && !isChips && !isPackages && <Panel
        width={rightWidth}
        minWidth={panelConfigs[2].minWidth}
        collapseWidth={panelConfigs[2].collapseWidth}
        showHandle={panelConfigs[2].showHandle}
        fill={panelConfigs[2].fill}
        noPadding={isSds}
        setResizer={setDetailResizer}
        header={isSds ? undefined :
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
        <Outlet context={{ detailWidth: detailResizer }} />
      </Panel>}
      <SdsEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        selectedCount={sdsSelected}
        onDelete={() => { console.log('delete', sdsSelected); setEditOpen(false) }}
        onDownload={() => { console.log('download', sdsSelected); setEditOpen(false) }}
      />
      <PackagePickerModal
        open={packagePickerOpen}
        onClose={() => setPackagePickerOpen(false)}
        onSelect={selectPackageTag}
        onClear={() => { removePackageTag(); setPackagePickerOpen(false) }}
        activePackage={packageTag}
      />
      <ToastSimple />
    </div>
  );
};

export default Layout;
