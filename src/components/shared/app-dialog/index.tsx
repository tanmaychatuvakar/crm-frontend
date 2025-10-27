import * as Dialog from "@radix-ui/react-dialog";
import { HiXMark } from "react-icons/hi2";
import {
  AppDialogTitleProps,
  AppDialogDescriptionProps,
  AppDialogProps,
} from "./app-dialog.props";

export const AppDialog: React.FC<AppDialogProps> & {
  Title: React.FC<AppDialogTitleProps>;
  Description: React.FC<AppDialogDescriptionProps>;
} = ({ trigger, children, onClose, ...rest }) => {
  return (
    <Dialog.Root {...rest}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 grid place-items-center overflow-y-auto z-20">
          <Dialog.Content className="relative bg-white shadow-sm rounded-sm p-8 w-[90vw] max-w-3xl">
            {children}
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center absolute top-6 right-6 rounded-full hover:bg-gray-300 hover:text-gray-700 w-6 h-6"
                aria-label="Close"
              >
                <HiXMark />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const AppDialogTitle: React.FC<AppDialogTitleProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <h1
      className="text-base font-bold leading-tight tracking-tight text-gray-900 md:text-lg"
      {...rest}
    >
      {children}
    </h1>
  );
};

const AppDialogDescription: React.FC<AppDialogDescriptionProps> = ({
  children,
}) => <span className="text-sm text-gray-400 font-light">{children}</span>;
AppDialog.Title = AppDialogTitle;
AppDialog.Description = AppDialogDescription;
