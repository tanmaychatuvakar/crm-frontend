import NavigationProps from "./Navigation.props";
import { ItemProps } from "./Item/Item.props";

export type NavigationType = React.FC<NavigationProps> & {
  Item: React.FC<ItemProps>;
};
