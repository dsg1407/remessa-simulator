import { InputHTMLAttributes, useState } from 'react'
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  currency?: string
  info?: string
  result?: boolean
}

export default function Input({
  name,
  label,
  placeholder = '',
  currency = '',
  className = '',
  info = '',
  result = false,
  ...rest
}: Props) {
  const [showHelp, setShowHelp] = useState(false)
  const [focus, setFocus] = useState(false)

  return (
    <div className="flex flex-1 w-full flex-col gap-1 ">
      <label
        htmlFor={name}
        className="flex text-sm md:text-base items-center gap-2 relative"
      >
        {label}{' '}
        {info && (
          <InfoIcon
            size={16}
            className="cursor-pointer"
            onClick={() => setShowHelp((state) => !state)}
          />
        )}
        {showHelp && (
          <div className="absolute end-1 border border-zinc-700 px-3 rounded">
            <p className="text-zinc-800 text-xs font-nunito">{info}</p>
          </div>
        )}
      </label>

      <div
        className={`p-4 rounded-md bg-white font-nunito flex items-center gap-2 border ${
          focus
            ? 'border-zinc-700'
            : result
            ? 'border-amber-300 text-red-500 font-bold text-base'
            : 'border-white'
        }`}
      >
        {currency && (
          <span className="text-zinc-700 font-semibold">{currency}</span>
        )}
        <input
          id={name}
          className={`flex-1 outline-none bg-transparent disabled:bg-transparent text-sm placeholder:text-base ${className}`}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...rest}
        />
      </div>
    </div>
  )
}
