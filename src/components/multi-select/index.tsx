import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { Avatar } from "../shared/avatar";
import { HiArrowLeft, HiArrowRight, HiXMark } from "react-icons/hi2";
import { MultiSelectProps } from "./multi-select.props";

export const MultiSelect: React.FC<MultiSelectProps> = ({
  items,
  values: defaultValues = [],
  onChange,
}) => {
  const [values, setValues] = useState<string[]>(defaultValues);
  const [selected, setSelected] = useState<string | undefined>();

  const handleOnClick = useCallback(
    (direction: "right" | "left") => {
      const set = new Set(values);
      if (direction === "left") {
        set.delete(selected!);
      } else {
        set.add(selected!);
      }
      const newValues = Array.from(set);

      setValues(newValues);
      onChange(newValues);
      setSelected(undefined);
    },
    [selected, values, setValues, onChange]
  );

  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  const selectedItems = items.filter((item) => values.includes(item.id));

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="border border-black border-opacity-60 rounded-sm w-full p-2 h-80 overflow-auto">
        <div className="flex flex-col">
          {items
            .filter((item) => !values.includes(item.id))
            .map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={classNames(
                  "cursor-pointer p-2 border-b border-black border-opacity-60 last:border-0",
                  {
                    "bg-gray-50": item.id === selected,
                  }
                )}
              >
                <div className="flex items-center gap-2">
                  <Avatar fallback="SA" />
                  <p className="font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="inline-flex flex-col gap-1">
        <button
          disabled={!selected}
          onClick={() => handleOnClick("left")}
          className="bg-gray-200 p-1.5 rounded shadow text-gray-800 disabled:bg-gray-50 disabled:text-gray-200"
        >
          <HiArrowLeft />
        </button>
        <button
          disabled={!selected}
          onClick={() => handleOnClick("right")}
          className="bg-gray-200 p-1.5 rounded shadow text-gray-800 disabled:bg-gray-50 disabled:text-gray-200"
        >
          <HiArrowRight />
        </button>

        <button
          disabled={!selected}
          onClick={() => setSelected(undefined)}
          className="mt-4 bg-red-200 p-1.5 rounded shadow text-gray-800 disabled:bg-red-50 disabled:text-gray-300"
        >
          <HiXMark />
        </button>
      </div>
      <div className="relative border border-black border-opacity-60 rounded-sm w-full p-2 h-80 overflow-auto">
        <div className="flex flex-col">
          {!selectedItems.length && (
            <p className="mt-40 self-center text-gray-500 text-sm font-light">
              Use the arrow keys to add or remove items
            </p>
          )}
          {selectedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={classNames(
                "cursor-pointer p-2 border-b border-black border-opacity-60 last:border-0",
                {
                  "bg-gray-50": item.id === selected,
                }
              )}
            >
              <div className="flex items-center gap-2">
                <Avatar fallback="SA" />
                <p className="font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
