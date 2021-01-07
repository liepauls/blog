import React, { useRef, useEffect } from 'react'
import Highlight from 'highlight.js/lib/core'

import javascript from 'highlight.js/lib/languages/javascript'
import ruby       from 'highlight.js/lib/languages/ruby'
import css        from 'highlight.js/lib/languages/css'
import sql        from 'highlight.js/lib/languages/sql'
import xml        from 'highlight.js/lib/languages/xml'
import bash       from 'highlight.js/lib/languages/bash'

Highlight.registerLanguage('javascript', javascript)
Highlight.registerLanguage('ruby', ruby)
Highlight.registerLanguage('css', css)
Highlight.registerLanguage('sql', sql)
Highlight.registerLanguage('xml', xml)
Highlight.registerLanguage('bash', bash)

import ImageComponent from './image'

const urlWithLabelRegex = /(https?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]{{[^}}]+}})/gi
const urlRegex          = /https?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/i
const labelRegex        = /{{([^}}]+)}}/

const ifString = (object, callback) => (
  typeof object === 'string' ? callback() : object
)

const urlifyText = (text) => (
  ifString(text, () => (
    text.split(urlWithLabelRegex).map((fragment, idx) => {
      if (fragment.match(urlWithLabelRegex)) {
        const href  = fragment.match(urlRegex)
        const label = fragment.match(labelRegex)[1]

        return (
          <a key={idx} className='hover:text-blue-900 underline' href={href} target='_blank'>
            {label}
          </a>
        )
      } else {
        return fragment
      }
    })
  ))
)

const withNewlines = (text) => (
  ifString(text, () => (
    text.split("\n").map((fragment, idx) => {
      if (fragment) {
        return fragment
      } else {
        return <br key={idx} />
      }
    })
  ))
)

const Header = ({ children }) => (
  <h2 className='text-3xl font-semibold mb-3 mt-14'>{children}</h2>
)

const Text = ({ children }) => (
  <p className='text-justify leading-relaxed text-lg'>{urlifyText(withNewlines(children))}</p>
)

const List = ({ children }) => (
  <ul className='list-disc pl-16 mt-3 text-lg'>
    {children.split("\n").map((item, i) => (
      <li key={i} className='my-1'>{urlifyText(item)}</li>
    ))}
  </ul>
)

const NumberedList = ({ children }) => (
  <ul className='list-decimal pl-20 mt-5 text-lg'>
    {children.split("\n").map((item, i) => (
      <li key={i} className='my-1'>{urlifyText(item)}</li>
    ))}
  </ul>
)

const CodeBlock = ({ children }) => {
  const ref = useRef(null)

  useEffect(() => {
    Highlight.highlightBlock(ref.current)
  }, [ref.current])

  return (
    <pre className='my-6'>
      <code ref={ref} className='text-sm border border-gray-100'>
        {children}
      </code>
    </pre>
  )
}

const Divider = () => (
  <div className='h-14' />
)

const Image = ({ src }) => {
  return (
    <div className='w-5/6 mx-auto my-12'>
      <ImageComponent src={src} />
    </div>
  )
}

export const componentMap = {
  header: Header,
  text: Text,
  list: List,
  numberedList: NumberedList,
  code: CodeBlock,
  image: Image,
  divider: Divider
}
