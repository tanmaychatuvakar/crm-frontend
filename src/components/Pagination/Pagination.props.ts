export interface Pagination {
  page: number
  pageSize: number
}
export interface PaginationProps extends Pagination {
  total: number
  onChange: (data: Pagination) => void
}
