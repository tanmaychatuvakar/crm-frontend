import { useState } from "react";
import { Pagination } from "./Pagination";
import { RiEqualizerFill } from "react-icons/ri";
import { AppDataTableProps } from "./AppDataTable.props";
import { ColumnsFilterDialog } from "./ColumnsFilterDialog";
import { Item } from "./Item";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Input } from "../shared";
import { HiOutlineSearch } from "react-icons/hi";

const LoadingRows: React.FC<{ columns: number }> = ({ columns }) => {
  return (
    <>
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <tr key={index}>
            {Array(columns)
              .fill(null)
              .map((_, index) => (
                <td className="px-6 py-4" key={index}>
                  <div className="h-2 bg-gray-200 rounded-full animate-pulse" />
                </td>
              ))}
          </tr>
        ))}
    </>
  );
};

export const AppDataTable: React.FC<AppDataTableProps> = ({
  columns: initialColumns,
  defaultPaginationValue,
  onPaginationChange,
  defaultSearchValue,
  onSearchChange,
  onRowClick,
  identifier,
  total,
  data,
  loading = false,
  filterable = false,
  searchable = false,
  rowKey = "id",
}) => {
  const [q, setQ] = useState(defaultSearchValue);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const [visible, setVisible] = useLocalStorage(
    identifier,
    initialColumns.map((column) => column.label)
  );

  const columns = initialColumns.filter((column) =>
    visible.includes(column.label)
  );

  return (
    <div>
      <div className="flex justify-between mb-1 p-2">
        {searchable && (
          <div className="w-48">
            <Input
              label="Search"
              placeholder="Search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              suffix={<HiOutlineSearch />}
            />
          </div>
        )}
        {filterable && (
          <button
            className="hover:bg-gray-200 rounded-sm p-1"
            onClick={() => setFilterDialogOpen(true)}
          >
            <RiEqualizerFill className="text-gray-900" />
          </button>
        )}
      </div>
      <div className="overflow-x-auto overflow-y-auto h-1/2 min-h-72 mb-6">
        <table className="w-full whitespace-nowrap">
          <thead className="sticky top-0 border-t border-b border-black text-sm">
            <tr>
              {columns?.map(({ label }) => {
                return (
                  <th
                    key={label}
                    scope="col"
                    className="px-4 py-2 text-left font-normal"
                  >
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="overflow-y-scroll">
            {loading ? <LoadingRows columns={columns.length} /> : null}
            {!loading && !data?.length ? (
              <tr>
                <td
                  className="px-6 py-4 text-center text-sm font-light"
                  colSpan={columns.length}
                >
                  No records available
                </td>
              </tr>
            ) : null}
            {!loading
              ? data?.map((row) => (
                  <Item
                    rowKey={rowKey}
                    key={row[rowKey]}
                    columns={columns}
                    row={row}
                    onRowClick={onRowClick}
                  />
                ))
              : null}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">
          Showing {data.length} of {total} entries
        </p>
        <Pagination
          total={total}
          defaultValue={defaultPaginationValue}
          onChange={onPaginationChange}
        />
      </div>
      <ColumnsFilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(!filterDialogOpen)}
        initialColumns={initialColumns}
        visible={visible}
        setVisible={setVisible}
      />
    </div>
  );
};
