export type MultiSelectProps = {
  items: { id: string; value: string }[];
  values: string[];
  onChange: (values: string[]) => any;
};
