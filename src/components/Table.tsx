
import React, { useState, useEffect, useRef } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
  createdAt?: string;
  status?: number;
  checkbox?: boolean;
}

interface Column {
  key: keyof Todo;
  header: string;
  type?: 'text' | 'date' | 'status' | 'checkbox';
  defaultValue?: string | number | boolean;
  truncate?: boolean;
}

interface TableProps {
  truncate?: boolean;
  search?: boolean;
  tabResizer?: number;
}

const states: Record<number, { title: string; color: string }> = {
  0: { title: 'Pending', color: 'blue' },
  1: { title: 'In Progress', color: 'yellow' },
  2: { title: 'Completed', color: 'green' },
  3: { title: 'Cancelled', color: 'red' },
};


const columns: Column[] = [
  { key: 'checkbox', header: '', type: 'checkbox' },
  { key: 'title', header: 'Title' },
  { key: 'completed', header: 'Completed' },
  { key: 'userId', header: 'User ID' },
  { key: 'createdAt', header: 'Created At', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
  { key: 'status', header: 'Status', type: 'status', defaultValue: 0 },
];

  function getColumnCount(width: number): number {
  const minW = 200;
  const maxW = 900;
  const minCols = 1;
  const maxCols = 6;
  const clamped = Math.min(Math.max(width, minW), maxW);
  const ratio = (clamped - minW) / (maxW - minW);
  const count = Math.round(minCols + ratio * (maxCols - minCols));
  return count;
}

const Table: React.FC<TableProps> = ({ truncate = true, search = true, tabResizer }) => {
  const [data, setData] = useState<Todo[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Column[]>([]);

  useEffect(() => {
    const count = getColumnCount(tabResizer)  
    if (count === 1) {
      setVisibleColumns([{ key: 'title', header: 'Title' }])  ;
      return
    }
      setVisibleColumns(columns.slice(0, getColumnCount(tabResizer))) ;
  }, [tabResizer]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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


  const toggleSelect = (id: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((row) => row.id)));
    }
  };

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const getCellValue = (row: Todo, key: keyof Todo) => {
    const col = columns.find((c) => c.key === key);

    const value = row[key] ?? col?.defaultValue;

    if (key === 'completed') return value ? 'Yes' : 'No';
    if (col?.type === 'checkbox') {
      const isSelected = selected.has(row.id);
      return (
        <svg
          className={`w-5 h-5 cursor-pointer ${isSelected ? 'text-green-500' : 'text-gray-400'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          onClick={() => toggleSelect(row.id)}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" />
          {isSelected && <path d="M9 12l2 2 4-4" stroke="currentColor" />}
        </svg>
      );
    }
    if (col?.type === 'date' && typeof value === 'string') {
      const date = new Date(value);
      return (
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm whitespace-nowrap">
          {date.toLocaleDateString('de-DE')}
        </span>
      );
    }
    if (col?.type === 'status' && typeof value === 'number') {
      const state = states[value] || states[0];
      const colorMap: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      };
      return (
        <span className={`inline-block px-2 py-1 rounded text-sm whitespace-nowrap ${colorMap[state.color]}`}>
          {state.title}
        </span>
      );
    }

    return value || '-';
  };

  const filteredData = searchTerm
    ? data.filter((row) =>
        columns.some((col) => {
          const value = row[col.key as keyof Todo];
          return value !== undefined && String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
    : data;

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn as keyof Todo];
    const bVal = b[sortColumn as keyof Todo];
    if (aVal === bVal) return 0;
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;
    const comparison = aVal < bVal ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div 
    ref={scrollRef} 
    className="overflow-auto h-full flex flex-col">
      {search && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pr-8 border-b border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          />
          {searchTerm && (
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              onClick={() => setSearchTerm('')}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          )}
        </div>
      )}
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            style={{
            boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
            transition: "box-shadow 0.2s ease",
          }}
        
        >
          <tr>
              {visibleColumns.map((col) => (
              <th
                key={col.key}
                className="p-2 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] cursor-pointer text-gray-700 dark:text-gray-300"
                title={col.header}
                onClick={() => col.type !== 'checkbox' && handleSort(col.key)}
              >
                {col.type === 'checkbox' ? (
                  <svg
                    className={`w-5 h-5 cursor-pointer ${selected.size === data.length && data.length > 0 ? 'text-green-500' : 'text-gray-400'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    onClick={toggleSelectAll}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" />
                    {selected.size === data.length && data.length > 0 && <path d="M9 12l2 2 4-4" stroke="currentColor" />}
                  </svg>
                ) : (
                  <span className="flex items-center gap-1">
                    {col.header}
                    {sortColumn === col.key && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        {sortDirection === 'asc' ? (
                          <path d="M12 5l8 8H4z" />
                        ) : (
                          <path d="M12 19l-8-8h16z" />
                        )}
                      </svg>
                    )}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={visibleColumns.length} className="p-8 text-center text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-400">No results found</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search criteria</span>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
            {visibleColumns.map((col) => (
                  <td
                    key={col.key}
                    className={`p-2 text-gray-700 dark:text-gray-300 ${truncate || col.truncate ? 'whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]' : ''}`}
                    title={typeof getCellValue(row, col.key) === 'string' ? getCellValue(row, col.key) as string : undefined}
                  >
                    {getCellValue(row, col.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};


export default Table;