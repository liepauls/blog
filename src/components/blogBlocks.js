import React, { useRef, useEffect } from 'react'
import Highlight from 'highlight.js/lib/core'

import javascript from 'highlight.js/lib/languages/javascript'
import ruby       from 'highlight.js/lib/languages/ruby'
import css        from 'highlight.js/lib/languages/css'
import scss       from 'highlight.js/lib/languages/scss'
import sql        from 'highlight.js/lib/languages/sql'
import xml        from 'highlight.js/lib/languages/xml'
import bash       from 'highlight.js/lib/languages/bash'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import yaml       from 'highlight.js/lib/languages/yaml'

Highlight.registerLanguage('javascript', javascript)
Highlight.registerLanguage('ruby', ruby)
Highlight.registerLanguage('css', css)
Highlight.registerLanguage('scss', scss)
Highlight.registerLanguage('sql', sql)
Highlight.registerLanguage('xml', xml)
Highlight.registerLanguage('bash', bash)
Highlight.registerLanguage('dockerfile', dockerfile)
Highlight.registerLanguage('yaml', yaml)

import ImageComponent from './image'

const Header = ({ children }) => (
  <h2 className='text-2xl font-semibold mb-5 mt-12'>{children}</h2>
)

const Text = ({ children }) => (
  <p className='text-justify leading-relaxed'>{children}</p>
)

const List = ({ children }) => (
  <ul className='list-disc pl-16 mt-4'>
    {children.split("\n").map((item, i) => (
      <li key={i} className='my-1'>{item}</li>
    ))}
  </ul>
)

const NumberedList = ({ children }) => (
  <ul className='list-decimal pl-16 mt-4'>
    {children.split("\n").map((item, i) => (
      <li key={i} className='my-1'>{item}</li>
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
  return <ImageComponent src={src} className='my-12' />
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
