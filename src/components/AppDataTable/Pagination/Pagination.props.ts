export type PaginationState = {
  currentPage: number;
  pageSize: number;
};

export interface PaginationProps {
  total: number;
  defaultValue?: PaginationState;
  onChange?: (pagination: PaginationState) => void;
}
