import React from "react";

import { NavigationType } from "./Navigation.type";
import { ItemProps } from "./Item/Item.props";
import { Item } from "./Item";

export const Navigation: NavigationType = ({ children }) => {
  const items = React.Children.toArray(children);
  return (
    <ol className="items-center w-full space-y-4 hidden sm:visible sm:flex sm:space-x-8 sm:space-y-0 mb-6 overflow-x-auto pb-2">
      {items.map((item, index) => {
        if (React.isValidElement<ItemProps>(item)) {
          return React.cloneElement(item, {
            index: index + 1,
            key: index,
          });
        }
      })}
    </ol>
  );
};

Navigation.Item = Item;
