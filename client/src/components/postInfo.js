import React from 'react'
import { formatDate } from '../utils/dateFunctions'

export default({ date, readTime, className }) => (
  <div className={className}>
    <span className='text-sm font-semibold text-gray-400'>
      <span className='mr-2'>
        {date && formatDate(date)}
      </span>
      •
      <span className='ml-2'>
        {readTime} read
      </span>
    </span>
  </div>
)
