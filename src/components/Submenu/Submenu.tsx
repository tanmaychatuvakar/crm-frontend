import { css } from "@/utils";
import { SubmenuProps } from "./Submenu.props";

export const Submenu: React.FC<SubmenuProps> = ({
  open,
  children,
  className,
}) => {
  return (
    <div
      className={css("rounded-lg absolute top-2 px-[3.2rem] py-[1.2rem] flex flex-col bg-white z-[1000] border border-[#dcdcdc] right-0", {
        "flex flex-col":open,
        "hidden": !open,
      }, className)}
    >
      {children}
    </div>
  );
};


