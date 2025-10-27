import { useCallback } from "react";
import { ItemProps } from "./Item.props";
import useStepper from "../../hooks/useStepper";
import classNames from "classnames";

export const Item: React.FC<ItemProps> = ({
  children,
  eventKey,
  index,
  error,
  icon,
}) => {
  const [activeKey, setActiveKey] = useStepper();
  const active = eventKey === activeKey;

  const handleClick = useCallback(
    (key: string) => {
      setActiveKey(key);
    },
    [setActiveKey]
  );

  return (
    <li
      onClick={() => handleClick(eventKey)}
      className={classNames(
        "flex items-center space-x-2.5",
        {
          "text-primary-600": active,
        },
        {
          "text-red-500": error && !active,
        },
        {
          "text-gray-500": !active,
        }
      )}
      role="button"
    >
      <span
        className={classNames(
          "flex items-center justify-center w-8 h-8 border rounded-full shrink-0",
          {
            "border-primary-600": active,
          },
          {
            "border-[red]": error && !active,
          },
          {
            "border-gray-500": !error && !active,
          }
        )}
      >
        {icon ?? index}
      </span>
      <span>{children}</span>
    </li>
  );
};
