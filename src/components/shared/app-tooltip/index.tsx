import * as Tooltip from "@radix-ui/react-tooltip";
import { AppTooltipProps } from "./app-tooltip.props";

import "./styles.css";

export const AppTooltip: React.FC<AppTooltipProps> = ({
  className,
  trigger,
  children,
  arrow = true,
  arrowClassName,
}) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{trigger}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            className={`bg-white shadow-md rounded p-3 text-sm select-none animate-slide ${className}`}
          >
            {children}
            {arrow ? (
              <Tooltip.Arrow className={`fill-white ${arrowClassName}`} />
            ) : null}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
