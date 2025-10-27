export type BadgeVariants = 'info' | 'dark' | 'danger' | 'success' | 'warning'| 'bright'
export type BadgeSize = 'default' | 'lg'

export interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariants
  bordered?: boolean
  pill?: boolean
  size?: BadgeSize
  icon?: React.ReactNode
  className?: string
}
