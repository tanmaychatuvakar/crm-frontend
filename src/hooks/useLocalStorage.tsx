import { useState } from "react";

export const useLocalStorage = (key: string, initialValue: any) => {
  const [value, setValue] = useState(() => {
    // Get the value from localStorage if it exists
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  const setLocalStorageValue = (newValue: unknown) => {
    setValue(newValue);
    // Store the value in localStorage
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  const removeLocalStorageValue = () => {
    setValue(null);
    // Remove the value from localStorage
    localStorage.removeItem(key);
  };

  return [value, setLocalStorageValue, removeLocalStorageValue];
};
