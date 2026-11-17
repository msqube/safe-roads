import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Download,
  ArrowLeft,
  ArrowRight,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { GenericButton } from './GenericButton';

export interface Column<T> {
  key: string;
  title: string;
  field?: keyof T;
  width?: string;
  align?: 'left' | 'center' | 'right';
  isSortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface GenericTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  enableExport?: boolean;
  exportFileName?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  headerActions?: React.ReactNode;
  filterComponent?: React.ReactNode;
  onRowClick?: (row: T) => void;
  highlightRowCondition?: (row: T) => string | undefined;
}

export function GenericTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  title,
  subtitle,
  isLoading = false,
  enableSearch = true,
  searchPlaceholder = 'Search records...',
  searchFields,
  enableExport = true,
  exportFileName = 'survey_report',
  initialPageSize = 15,
  pageSizeOptions = [10, 15, 25, 50, 65],
  headerActions,
  filterComponent,
  onRowClick,
  highlightRowCondition,
}: GenericTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Sorting
  const handleSort = (key: string, isSortable?: boolean) => {
    if (!isSortable) return;
    if (sortKey === key) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter((row) => {
      if (searchFields && searchFields.length > 0) {
        return searchFields.some((field) => {
          const val = row[field];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
        });
      }
      return Object.values(row).some(
        (val) => val !== undefined && val !== null && String(val).toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm, searchFields]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const col = columns.find((c) => c.key === sortKey);
    const field = col?.field || sortKey;

    return [...filteredData].sort((a, b) => {
      const valA = a[field as keyof T];
      const valB = b[field as keyof T];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      let comparison = 0;
      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortOrder, columns]);

  // Pagination
  const totalEntries = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const pageIndex = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pageIndex, pageSize]);

  // Export Excel (.xls format compatible with Microsoft Excel & Google Sheets)
  const handleExportExcel = () => {
    if (sortedData.length === 0) return;
    const exportCols = columns.filter((c) => c.field || c.key);

    let tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        th { background-color: #1a73e8; color: #ffffff; font-weight: bold; border: 1px solid #dadce0; padding: 8px; text-align: left; font-family: sans-serif; }
        td { border: 1px solid #dadce0; padding: 6px; font-family: sans-serif; font-size: 11px; }
        .header-title { font-size: 14pt; font-weight: bold; color: #202124; }
      </style>
    </head>
    <body>
      <table>
        <tr><td colspan="${exportCols.length}" class="header-title">SafeRoads — Road Defect & Pothole Surveillance Report</td></tr>
        <tr><td colspan="${exportCols.length}">Area: New Town Kolkata Development Authority (NKDA / WBHIDCO) | Export Date: ${new Date().toLocaleString()}</td></tr>
        <tr></tr>
        <tr>
          ${exportCols.map((c) => `<th>${c.title}</th>`).join('')}
        </tr>`;

    sortedData.forEach((row) => {
      tableHtml += '<tr>';
      exportCols.forEach((c) => {
        const key = (c.field || c.key) as keyof T;
        const val = row[key];
        const displayVal = val === undefined || val === null ? '' : String(val);
        tableHtml += `<td>${displayVal}</td>`;
      });
      tableHtml += '</tr>';
    });

    tableHtml += '</table></body></html>';

    const blob = new Blob(['\ufeff', tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${exportFileName}_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export PDF (clean printable document)
  const handleExportPDF = () => {
    if (sortedData.length === 0) return;
    const exportCols = columns.filter((c) => c.field || c.key);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const rowsHtml = sortedData
      .map((row) => {
        return `<tr>${exportCols
          .map((c) => {
            const key = (c.field || c.key) as keyof T;
            const val = row[key];
            return `<td>${val === undefined || val === null ? '' : String(val)}</td>`;
          })
          .join('')}</tr>`;
      })
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SafeRoads - Road Survey Report PDF</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 24px; color: #202124; }
            .header { border-bottom: 2px solid #1a73e8; padding-bottom: 12px; margin-bottom: 16px; }
            h1 { margin: 0 0 6px 0; font-size: 20px; color: #1a73e8; }
            p { margin: 0; font-size: 12px; color: #5f6368; }
            table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 11px; }
            th { background: #f1f3f4; color: #202124; border: 1px solid #dadce0; padding: 8px 6px; text-align: left; font-weight: 600; }
            td { border: 1px solid #dadce0; padding: 6px; }
            tr:nth-child(even) { background-color: #f8f9fa; }
            @media print {
              @page { size: landscape; margin: 12mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SafeRoads — Autonomous Drone & NSV Road Defect Survey Report</h1>
            <p>New Town Kolkata (Action Area I, II, III & CBD) • Generated: ${new Date().toLocaleString()} • Total Segments: ${sortedData.length}</p>
          </div>
          <table>
            <thead>
              <tr>${exportCols.map((c) => `<th>${c.title}</th>`).join('')}</tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Top Header & Toolbar */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {enableSearch && (
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {enableExport && (
              <div className="flex items-center gap-1.5">
                <GenericButton
                  variant="secondary"
                  size="sm"
                  leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
                  onClick={handleExportExcel}
                  title="Export complete report to Excel spreadsheet"
                >
                  Export Excel
                </GenericButton>
                <GenericButton
                  variant="secondary"
                  size="sm"
                  leftIcon={<FileText className="w-3.5 h-3.5 text-red-600" />}
                  onClick={handleExportPDF}
                  title="Export printable PDF report"
                >
                  Export PDF
                </GenericButton>
              </div>
            )}

            {headerActions}
          </div>
        </div>

        {filterComponent && <div className="pt-2">{filterComponent}</div>}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto relative min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const isSortable = col.isSortable;

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => handleSort(col.key, isSortable)}
                    className={`px-3.5 py-3 select-none ${
                      isSortable ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''
                    } ${
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1 ${
                        col.align === 'center'
                          ? 'justify-center'
                          : col.align === 'right'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <span>{col.title}</span>
                      {isSortable && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortOrder === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading survey records...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                  <p className="font-medium text-slate-700">No records found</p>
                  <p className="text-xs text-slate-400 mt-0.5">Try clearing filters or search terms.</p>
                  {searchTerm && (
                    <GenericButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-blue-600"
                    >
                      Clear search
                    </GenericButton>
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const key = String(row[rowKey] ?? idx);
                const customRowClass = highlightRowCondition ? highlightRowCondition(row) : '';

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`hover:bg-slate-50 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${customRowClass || ''}`}
                  >
                    {columns.map((col) => {
                      const field = col.field || (col.key as keyof T);
                      const val = row[field];

                      return (
                        <td
                          key={col.key}
                          className={`px-3.5 py-3 ${
                            col.align === 'center'
                              ? 'text-center'
                              : col.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                          }`}
                        >
                          {col.render ? col.render(row, idx) : (val !== undefined && val !== null ? String(val) : '—')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-slate-800">{totalEntries === 0 ? 0 : (pageIndex - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-800">{Math.min(pageIndex * pageSize, totalEntries)}</strong> of{' '}
            <strong className="text-slate-800">{totalEntries}</strong> entries
          </span>

          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 text-slate-700 text-xs rounded px-2 py-0.5 focus:outline-none focus:border-blue-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <GenericButton
            variant="secondary"
            size="sm"
            disabled={pageIndex <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Prev
          </GenericButton>

          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded font-medium text-slate-700 text-xs">
            {pageIndex} / {totalPages}
          </span>

          <GenericButton
            variant="secondary"
            size="sm"
            disabled={pageIndex >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Next
          </GenericButton>
        </div>
      </div>
    </div>
  );
}
