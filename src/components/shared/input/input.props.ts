import { ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: any;
  suffix?: string | ReactNode;
  hasPrefix?: boolean;
  required?:boolean;
}

export default InputProps;
