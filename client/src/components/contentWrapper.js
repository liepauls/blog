import React from 'react'

export default({ children }) => (
  <div className='relative min-h-screen'>
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
