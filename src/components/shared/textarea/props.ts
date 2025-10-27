import { ReactNode } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  suffix?: string | ReactNode
}

export default TextareaProps
