import React from 'react'
import { formatDate } from '../utils/dateFunctions'

export default({ date, className }) => (
  <div className={`${className} text-sm font-semibold text-gray-400 text-sm`}>
    {date && formatDate(date)}
  </div>
)
