import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function FormGroup({ children, className, ...rest }: Props) {
  return (
    <div
      className={`flex flex-col md:flex-row w-full items-center justify-between mt-4 gap-3 md:gap-2 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
