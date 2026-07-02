import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
  status?: number;
}

interface TableProps {
  search?: boolean;
  tabResizer?: number;
  columnsOpen?: boolean;
  onColumnsClose?: () => void;
}

const states: Record<number, { title: string; color: string }> = {
  0: { title: 'Open',        color: 'blue'   },
  1: { title: 'In Progress', color: 'yellow' },
  2: { title: 'Done',        color: 'green'  },
  3: { title: 'Cancelled',   color: 'red'    },
};

const chipColors: Record<string, string> = {
  blue:   'bg-blue-50   text-blue-600   dark:bg-blue-500/10   dark:text-blue-400',
  yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400',
  green:  'bg-green-50  text-green-600  dark:bg-green-500/10  dark:text-green-400',
  red:    'bg-red-50    text-red-500    dark:bg-red-500/10    dark:text-red-400',
};

const dotColors: Record<string, string> = {
  blue:   'bg-blue-400   dark:bg-blue-500',
  yellow: 'bg-yellow-400 dark:bg-yellow-500',
  green:  'bg-green-500  dark:bg-green-400',
  red:    'bg-red-400    dark:bg-red-500',
};

type ColKey = 'title' | 'userId' | 'completed' | 'status'

interface ColDef {
  key: ColKey
  label: string
}

const colDefs: ColDef[] = [
  { key: 'title',     label: 'Title'     },
  { key: 'status',    label: 'Status'    },
  { key: 'userId',    label: 'ID'        },
  { key: 'completed', label: 'Done'      },
]

const DEFAULT_USER_COLS: ColKey[] = ['title', 'status', 'userId', 'completed']

type Mode = 'collapsed' | 'narrow' | 'full'

const COLLAPSE_WIDTH = parseInt(import.meta.env.VITE_PANEL_COLLAPSE_WIDTH) || 40;
const NARROW_WIDTH   = parseInt(import.meta.env.VITE_TABLE_NARROW_WIDTH)   || 280;

const getMode = (width: number): Mode => {
  if (width <= COLLAPSE_WIDTH) return 'collapsed'
  if (width <= NARROW_WIDTH)   return 'narrow'
  return 'full'
}

const Table: React.FC<TableProps> = ({ search = true, tabResizer = 400, columnsOpen = false, onColumnsClose }) => {
  const [data, setData]               = useState<Todo[]>([]);
  const [selected, setSelected]       = useState<Set<number>>(new Set());
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [searchTerm, setSearchTerm]   = useState('');
  const [mode, setMode]               = useState<Mode>(() => getMode(tabResizer));
  const [userCols, setUserCols]       = useState<ColKey[]>(DEFAULT_USER_COLS);

  useEffect(() => { setMode(getMode(tabResizer)); }, [tabResizer]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res  = await fetch('https://jsonplaceholder.typicode.com/todos');
        const json: Todo[] = await res.json();
        setData(json.map((row) => ({ ...row, status: row.id % 4 })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const toggleSelect = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleUserCol = (key: ColKey) => {
    setUserCols((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const activeCols: ColKey[] =
    mode === 'collapsed' ? [] :
    mode === 'narrow'    ? userCols.slice(0, 2) :
    userCols

  const filteredData = searchTerm
    ? data.filter((row) => row.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : data;


  const renderCell = (col: ColKey, row: Todo) => {
    const isSelected = selected.has(row.id);
    const status = states[row.status ?? 0] ?? states[0];

    switch (col) {
      case 'status':
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${chipColors[status.color]}`}>
            {status.title}
          </span>
        )
      case 'title':
        return (
          <span
            className={`text-sm line-clamp-2 ${isSelected ? 'font-medium' : 'text-gray-700 dark:text-gray-300'}`}
            style={isSelected ? { color: 'var(--accent)' } : {}}
          >
            {row.title}
          </span>
        )
      case 'userId':
        return (
          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
            #{row.userId}
          </span>
        )
      case 'completed':
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${row.completed
            ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
            : 'text-gray-400 dark:text-gray-500'}`}>
            {row.completed ? 'Yes' : 'No'}
          </span>
        )
    }
  }

  const allSelected = filteredData.length > 0 && selected.size === filteredData.length;

  return (
    <div className="h-full flex flex-col">

      {/* Search bar */}
      {search && mode !== 'collapsed' && (
        <div className="flex items-center gap-2 py-3 px-4">
          <div className="relative flex-1 flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 gap-2 focus-within:border-gray-300 dark:focus-within:border-white/20 transition-colors">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search items"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
            />
            {searchTerm && (
              <svg className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={() => setSearchTerm('')}>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <button
            onClick={() => setAdvancedOpen(true)}
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            title="Filters"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Columns modal */}
      <Modal
        open={!!columnsOpen}
        onClose={onColumnsClose!}
        title="Columns"
        subtitle="Show or hide table columns."
        icon="mdi:table-column"
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col px-6 pb-6 gap-1">
          {colDefs.map((col) => {
            const isActive = userCols.includes(col.key)
            return (
              <button
                key={col.key}
                onClick={() => toggleUserCol(col.key)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#f5f7fa] dark:hover:bg-white/5 transition-colors"
              >
                <span className="text-[14px] text-[#334155] dark:text-gray-300">{col.label}</span>
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? '' : 'border-gray-300 dark:border-gray-600'}`}
                  style={isActive ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
                >
                  {isActive && <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
              </button>
            )
          })}
        </div>
      </Modal>

      {/* Filters modal */}
      <Modal
        open={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        title="Filters"
        subtitle="Narrow down the table rows."
        icon="mdi:filter-outline"
      >
        <div className="px-6 pb-6">
          <p className="text-[14px] text-[#64748b] dark:text-gray-500">Content TBD</p>
        </div>
      </Modal>

      {/* Table */}
      <div className={`flex-1 min-h-0 overflow-auto ${mode === 'collapsed' ? 'px-0 overflow-x-hidden' : 'px-4'}`}>
        <table className="w-full border-collapse">
          {mode !== 'collapsed' && (
            <thead>
              <tr>
                <th className="w-10 px-3 h-9 text-left sticky top-0 bg-white dark:bg-[#1e1e1e]">
                  <svg
                    className="w-5 h-5 cursor-pointer transition-colors"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ color: allSelected ? 'var(--accent)' : undefined }}
                    onClick={() => allSelected ? setSelected(new Set()) : setSelected(new Set(filteredData.map((r) => r.id)))}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" className={allSelected ? '' : 'stroke-gray-300 hover:stroke-gray-400'} />
                    {allSelected && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                </th>
                {activeCols.map((col) => (
                  <th
                    key={col}
                    className={`h-9 px-2 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-[#1e1e1e] ${col === 'title' ? '' : 'w-28'}`}
                  >
                    {colDefs.find((d) => d.key === col)?.label}
                  </th>
                ))}
              </tr>
              <tr><td colSpan={activeCols.length + 1} className="h-px bg-gray-100 dark:bg-white/5 p-0 sticky top-9" /></tr>
            </thead>
          )}
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={activeCols.length + 1} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    {mode !== 'collapsed' && <span className="text-base font-medium">No results found</span>}
                    {mode !== 'collapsed' && <span className="text-sm">Try adjusting your search criteria</span>}
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row) => {
                const isSelected = selected.has(row.id);
                const status = states[row.status ?? 0] ?? states[0];
                return (
                  <tr
                    key={row.id}
                    title={mode === 'collapsed' ? row.title : undefined}
                    className={`border-b border-gray-100 dark:border-white/5 transition-colors duration-100 ${isSelected ? '' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    style={isSelected ? { backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)' } : {}}
                  >
                    <td className={`py-2.5 align-middle ${mode === 'collapsed' ? 'w-full px-0' : 'w-10 px-3'}`}>
                      {mode === 'collapsed' ? (
                        <div className={`w-3.5 h-3.5 rounded-full mx-auto ${dotColors[status.color]}`} />
                      ) : (
                        <svg
                          className="w-5 h-5 cursor-pointer transition-colors"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          onClick={() => toggleSelect(row.id)}
                        >
                          <rect
                            x="3" y="3" width="18" height="18" rx="2"
                            className={isSelected ? '' : 'fill-none stroke-gray-300 hover:stroke-gray-400'}
                            style={isSelected ? { fill: 'var(--accent)', stroke: 'var(--accent)' } : {}}
                          />
                          {isSelected && <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth="2.5" />}
                        </svg>
                      )}
                    </td>
                    {mode !== 'collapsed' && activeCols.map((col) => (
                      <td key={col} className="px-2 py-2.5 align-top">
                        {renderCell(col, row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {mode !== 'collapsed' && (
        <div className="flex-shrink-0 flex items-center justify-between px-3 h-8 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {filteredData.length} of {data.length}
          </span>
          <span
            className="text-[11px] font-medium"
            style={selected.size > 0 ? { color: 'var(--accent)' } : { color: 'transparent' }}
          >
            {selected.size} selected
          </span>
        </div>
      )}
    </div>
  );
};

export default Table;
