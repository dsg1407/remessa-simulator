import { CaretDown } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'

interface Props {
  title: string
  texts: string[]
  example?: string
  links?: LinkProp[]
}

interface LinkProp {
  name: string
  url: string
}

export default function SectionMenu({ title, texts, example, links }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div
      className={`flex flex-col
      `}
    >
      <h2
        className={`w-full flex items-center justify-between font-nunito font-semibold text-base p-2 bg-zinc-300 rounded-t ${
          !show && 'rounded-b'
        }`}
      >
        {title}
        <CaretDown
          size={24}
          weight="regular"
          className="hover:bg-zinc-200 cursor-pointer rounded transition duration-300"
          onClick={() => setShow((state) => !state)}
        />
      </h2>
      <p
        className={`text-justify border-x border-x-zinc-300 border-b border-b-zinc-300 rounded-b p-2 transition-all ease-linear ${
          !show && 'h-0 p-0 border-none -z-10'
        }`}
      >
        {texts.map((text, i) =>
          texts.length > 1 && i > 0 ? (
            <span className="block">{text}</span>
          ) : (
            text
          )
        )}
        {example && (
          <span className="block text-center py-2 bg-amber-100 text-zinc-800 rounded text-xs mt-4 mb-2 font-nunito font-semibold">
            {example}
          </span>
        )}
        {links &&
          links.map(({ name, url }) => (
            <a href={url} target="_blank" className="block m-1 text-sky-600">
              {name}
            </a>
          ))}
      </p>
    </div>
  )
}
