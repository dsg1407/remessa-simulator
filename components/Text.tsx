import { ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<'p'> {
  children: React.ReactNode
  heading?: boolean
  className?: string
}

export default function Text({
  children,
  heading = false,
  className = '',
  ...rest
}: Props) {
  return (
    <>
      {heading ? (
        <h1
          className={`font-bold text-3xl xl:text-4xl font-nunito
          ${className}`}
          {...rest}
        >
          {children}
        </h1>
      ) : (
        <p className={`${className}`} {...rest}>
          {children}
        </p>
      )}
    </>
  )
}
