import SelectProps from "./select.props";
import { Error } from "../error";
import { useCallback } from "react";
import { FaSpinner } from "react-icons/fa6";
import { css } from "@/utils";

export const AppSelect: React.FC<SelectProps> = ({
  value,
  options = [],
  onChange,
  label,
  disabled,
  error,
  required = false,
  loading = false,
}) => {
  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      onChange?.(value !== "" ? value : undefined);
    },
    [onChange]
  );
  return (
    <div className="w-full relative">
      <span className="absolute top-[-10px] left-[1rem] z-10 pl-1 pr-2 text-[0.8rem] font-light bg-white text-black/50">
        <span>{label}</span>
        {required && <span className="text-sm text-red-600">*</span>}
      </span>
      <select
        disabled={disabled || loading}
        value={value ?? undefined}
        onChange={handleOnChange}
        className={css("block w-full px-5 py-2.5", {
          "border-gray-400": disabled,
        })}
      >
        <option value="">Select ...</option>
        {options.map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>
      {loading ? (
        <div className="absolute top-4 right-8 text-gray-400">
          <FaSpinner className="animate-spin" />
        </div>
      ) : null}
      {error ? <Error className="mt-1" error={error} /> : null}
    </div>
  );
};
