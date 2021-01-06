import React from 'react'

export default({ tags, className }) => {
  tags = tags?.filter(Boolean)

  if (!tags || tags.length === 0) return null

  return (
    <div className={className}>
      {tags?.map(tag => (
        <span className='bg-gray-100 border border-gray-300 px-2 py-1 rounded-lg text-xs mr-3 text-gray-800 cursor-default' key={tag}>
          {tag}
        </span>
      ))}
    </div>
  )
}
