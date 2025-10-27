export type Column<T = any> = {
  label: string;
  accessor?: string;
  render?: (row: T) => React.ReactNode;
};
