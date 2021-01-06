import React from 'react'

import placeholder from '../../images/placeholder.png'

export default({ src, className }) => (
  <img className={`${className} object-cover w-full h-full`}
       src={src ? `${process.env.API_URL}/uploads/${src}` : placeholder} />
)
