import React, { useContext } from 'react'
import Helmet from 'react-helmet'

import { Context } from './application'

const DEFAULTS = {
  tags:    ['blog', 'software', 'development', 'ruby'],
  title:   'hey, there!',
  preview: 'Hello, my name is Pauls and this is my blog about stuff',
}

export default({ children }) => {
  const { post } = useContext(Context)

  const renderMetaTags = () => {
    const { title, preview, tags, titleImage, createdAt } = post || DEFAULTS

    return (
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={preview} />
        <meta name='keywords' content={tags.join(', ')} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={preview} />
        <meta property='article:tag' content={tags.join(', ')} />
        <meta property='og:image' content={titleImage} />
        <meta property='article:published_time' content={createdAt} />
      </Helmet>
    )
  }

  return (
    <div className='relative min-h-screen'>
      {renderMetaTags()}

      <div className='container text-container pb-5'>
        {children}
      </div>

      <footer className='absolute w-full bottom-0 text-right text-gray-400 pb-3 pr-4'>
        <a className='mr-2 hover:text-blue-900' href='https://github.com/liepauls' target='_blank'>github</a>
        <span className='text-gray-500'>|</span>
        <a className='ml-2 hover:text-blue-900' href='mailto:liepauls@gmail.com'>email</a>
      </footer>
    </div>
  )
}
