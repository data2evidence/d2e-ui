import type { SVGProps } from 'react'

interface MenuIconProps {
  width?: number
  height?: number
  color?: string
}

export const MenuIcon = ({
  width = 24,
  height = 24,
  color = 'navy',
  ...props
}: SVGProps<SVGSVGElement> & MenuIconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M3 5h18a1 1 0 0 1 0 2H3a1 1 0 1 1 0-2zm0 6h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 6h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z"
      fill={color}
      fillRule="evenodd"
    />
  </svg>
)
