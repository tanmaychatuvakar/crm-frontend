import { Checkbox, AppDialog } from "@/components/shared";
import { ColumnsFilterDialogProps } from "./ColumnsFilterDialog.props";

export const ColumnsFilterDialog: React.FC<ColumnsFilterDialogProps> = ({
  initialColumns,
  visible,
  setVisible,
  ...rest
}) => {
  return (
    <AppDialog {...rest}>
      <AppDialog.Title>Columns</AppDialog.Title>
      <AppDialog.Description>
        Choose the columns you want to show in the table
      </AppDialog.Description>
      <div className="grid grid-cols-12 gap-3 mt-6">
        {initialColumns.map((column) => (
          <div key={column.label} className="col-span-12 sm:col-span-6">
            <Checkbox
              checked={visible.includes(column.label)}
              onChange={() => {
                if (visible.includes(column.label)) {
                  if (visible.length - 1 === 0) return;
                  return setVisible(
                    visible.filter((label) => label !== column.label)
                  );
                }
                setVisible([...visible, column.label]);
              }}
              label={column.label}
              value={column.label}
            />
          </div>
        ))}
      </div>
    </AppDialog>
  );
};
