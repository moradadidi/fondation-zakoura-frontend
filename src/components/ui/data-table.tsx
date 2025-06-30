import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, ArrowUpDown, Search } from "lucide-react"

export interface Column<T> {
  key: keyof T | string
  header: React.ReactNode
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string | number
  align?: "left" | "center" | "right"
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyText?: string
  striped?: boolean
  hoverEffect?: boolean
  rowHeight?: "sm" | "md" | "lg"
  headerStyle?: "light" | "dark" | "primary"
  onRowClick?: (row: T) => void
  className?: string
}

export function DataTable<T extends object>({
  columns,
  data,
  emptyText = "No data available",
  striped = true,
  hoverEffect = true,
  rowHeight = "md",
  headerStyle = "light",
  onRowClick,
  className = ""
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof T | string; direction: "asc" | "desc" } | null>(null);
  
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];
      
      if (aValue === bValue) return 0;
      
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const requestSort = (key: keyof T | string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getRowHeightClass = () => {
    switch (rowHeight) {
      case "sm": return "h-10";
      case "md": return "h-12";
      case "lg": return "h-14";
      default: return "h-12";
    }
  };

  const getHeaderStyleClass = () => {
    switch (headerStyle) {
      case "dark": return "bg-gray-800 text-white";
      case "primary": return "bg-[#008c95] text-white";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className={`${getHeaderStyleClass()} border-b border-gray-200`}>
            {columns.map(col => (
              <TableHead 
                key={String(col.key)}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}`}
                style={{ width: col.width }}
              >
                <div className={`flex items-center ${col.sortable ? "cursor-pointer hover:text-gray-900" : ""} ${col.align === "center" ? "justify-center" : col.align === "right" ? "justify-end" : ""}`}
                  onClick={() => col.sortable && requestSort(col.key)}
                >
                  {col.header}
                  {col.sortable && (
                    <span className="ml-1">
                      {sortConfig?.key === col.key ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="text-center py-16 bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <div className="bg-gray-200 rounded-full p-3 mb-3">
                    <Search className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-medium">{emptyText}</p>
                  <p className="mt-1 text-sm max-w-md">
                    Try adjusting your search or filter to find what you're looking for
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, i) => (
              <TableRow 
                key={i}
                className={`
                  ${getRowHeightClass()} 
                  ${striped ? (i % 2 === 0 ? "bg-white" : "bg-gray-50") : "bg-white"}
                  ${hoverEffect ? "hover:bg-gray-100 transition-colors" : ""}
                  ${onRowClick ? "cursor-pointer" : ""}
                  border-b border-gray-100 last:border-b-0
                `}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map(col => (
                  <TableCell 
                    key={String(col.key)}
                    className={`
                      px-4 py-3 text-sm font-medium text-gray-800
                      ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}
                    `}
                  >
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}