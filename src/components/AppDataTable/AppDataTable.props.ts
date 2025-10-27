import { Column } from "@/types/column.type";
import { PaginationState } from "./Pagination/Pagination.props";

export interface AppDataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  identifier: string;
  total: number;
  rowKey?: string;
  loading?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  defaultPaginationValue?: PaginationState;
  defaultSearchValue?: string;
  onPaginationChange?: (state: PaginationState) => void;
  onSearchChange?: (query: string) => void;
  onRowClick?: (row: any) => void;
}
