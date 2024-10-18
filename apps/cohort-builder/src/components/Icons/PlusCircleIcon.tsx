import type { SVGProps } from 'react'

interface PlusCircleIconProps {
  width?: number
  height?: number
  color?: string
}

export const PlusCircleIcon = ({
  width = 24,
  height = 24,
  color = 'navy',
  ...props
}: SVGProps<SVGSVGElement> & PlusCircleIconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fill-rule="evenodd">
      <circle cx="11" cy="11" r="11" transform="translate(1 1.301)" stroke={color} stroke-width="1.5" />
      <path
        d="M17.833 11.468h-5v-5a.833.833 0 1 0-1.666 0v5h-5a.833.833 0 1 0 0 1.667h5v5a.833.833 0 1 0 1.666 0v-5h5a.833.833 0 1 0 0-1.667"
        fill={color}
      />
    </g>
  </svg>
)
