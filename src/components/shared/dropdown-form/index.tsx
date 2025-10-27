import clsx from "clsx";
import { HiChevronDown } from "react-icons/hi";
import { DropdownFormProps } from "./props";
import { twMerge } from "tailwind-merge";
import { css } from "@/utils";

export const DropdownForm: React.FC<DropdownFormProps> = ({
  isOpen,
  error,
  close,
  reset,
  label,
  children,
}) => {
  return (
    <div className="relative">
      <button
        onClick={close}
        className={twMerge(
          clsx(
            "inline-flex items-center border border-black py-1 px-4 rounded-full transition-all hover:opacity-80",
            { "text-blue-500 border-blue-500 hover:opacity-80": isOpen },
            { "border-red-500 text-red-500  hover:opacity-80": error }
          )
        )}
      >
        <span>{label}</span>
        <span className={css("ml-2 transition-all", { "-rotate-180": isOpen })}>
          <HiChevronDown />
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-10 right-0 border border-black bg-white z-10 p-4 min-w-[20rem]">
          {children}
          <div className="flex justify-between space-x-2 items-center mt-8">
            <button onClick={close} className="text-sm font-medium">
              Close
            </button>
            <button
              onClick={reset}
              className="border border-black font-medium text-sm px-3 py-1"
            >
              Reset to default
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
