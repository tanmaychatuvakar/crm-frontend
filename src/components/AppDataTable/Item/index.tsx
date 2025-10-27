import { ItemProps } from "./Item.props";

export const Item: React.FC<ItemProps> = ({
  columns,
  row,
  rowKey,
  onRowClick,
}) => {
  return (
    <tr
      className="border-b border-gray-200 cursor-pointer"
      onClick={() => onRowClick?.(row)}
    >
      {columns.map(({ accessor, render }, index) => (
        <td className="px-4 py-2 text-left font-light text-[0.875rem]" key={`${row[rowKey]}-col-${index}`}>
          {accessor ? row[accessor] ?? "-" : render?.(row)}
        </td>
      ))}
    </tr>
  );
};
