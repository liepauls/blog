import React from 'react'

import placeholder from '../../images/placeholder.png'

export default({ src, className }) => (
  <img className={`${className} object-cover w-full h-full`}
       src={src ? `http://localhost:3000/api/uploads/${src}` : placeholder} />
)
