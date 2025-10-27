interface Link {
  path: string
  label: string
  icon?: React.ReactNode
}

interface Section{
  title: string
  links: Link[]
}

export interface SidebarProps {
  sections: Section[]
  children?: React.ReactNode
  drawerOpen?: boolean
  classes?: string
}
