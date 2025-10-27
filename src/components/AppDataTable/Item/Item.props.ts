import { AppDataTableProps } from "../AppDataTable.props";

export interface ItemProps
  extends Pick<AppDataTableProps, "columns" | "onRowClick"> {
  row: Record<string, any>;
  rowKey: string;
}
