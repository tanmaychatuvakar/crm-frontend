import { AppDialogProps } from "../shared/app-dialog/app-dialog.props";
export interface SearchDialogProps extends AppDialogProps {
  searchQuery: {};
  setSearchQuery: any;
  queryKey: {}[];
  path: string;
  mode: string;
}
