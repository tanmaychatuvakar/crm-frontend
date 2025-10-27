import { AppDialog } from "../shared";
import { SearchForm } from "./Form";
import { SearchDialogProps } from "./SearchDialog.props";

export const SearchDialog: React.FC<SearchDialogProps> = ({
  searchQuery,
  setSearchQuery,
  queryKey,
  onClose,
  path,
  mode,
  ...rest
}: any) => {
  // const { data, isSuccess, isError, refetch } = useSearchQuery(path, searchQuery)
  // const handleSubmit = () => {
  //   refetch()
  // }

  // useEffect(() => {
  //   if (isSuccess) {
  //     queryClient.setQueryData(queryKey, data?.data)
  //     onClose()
  //   }

  // }, [isSuccess, isError])

  return (
    <AppDialog onClose={onClose} {...rest}>
      <AppDialog.Title>Search</AppDialog.Title>
      <SearchForm
        onSubmit={() => false}
        onClose={onClose}
        setSearch={setSearchQuery}
        mode={mode}
      />
    </AppDialog>
  );
};
