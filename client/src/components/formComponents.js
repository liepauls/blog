import React, { useRef } from 'react'

import { componentMap } from '../components/blogBlocks'

export const Button = ({ children, color, onClick, className }) => (
  <button className={`border px-5 py-2 rounded-md border-${color} text-${color} ${className}`} onClick={onClick}>
    {children}
  </button>
)

export const Input = ({ id, value, onChange, label, type, rows, errors = [] }) => {
  const Component = type === 'textarea' ? 'textarea' : 'input'
  const className = type === 'file' ? 'py-1' : 'border-gray-300 border rounded-md block w-full py-1 px-2'
  const error     = errors?.find(e => e.path === id)
  const inputRef  = useRef(null)

  const handledOnChange = (e) => {
    if (type === 'file') {
      onChange(inputRef.current.files[0])
    } else {
      onChange(e.target.value)
    }
  }

  return (
    <div className='my-4'>
      {label && <label htmlFor={id} className='block mb-1'>{label}</label>}
      <Component id={id}
                 className={className}
                 value={value}
                 onChange={handledOnChange}
                 type={type}
                 ref={inputRef}
                 rows={rows} />
      {error && <div className='text-red-700'>{error.message}</div>}
    </div>
  )
}

export const ContentBlock = ({ type, image, text, onChange, onRemove, idx }) => {
  const isImage = type === 'image'
  const rows    = type === 'header' ? 1 : 6

  return (
    <div className='border p-3 pb-0 rounded-md border-gray-300 mt-5'>
      <div className='flex'>
        <select className='border-gray-300 border rounded-md block w-full py-1 px-2 mr-5'
                value={type}
                onChange={e => onChange(idx, 'type', e.target.value)}>
          {Object.keys(componentMap).map(option =>
            <option key={option} value={option}>{option}</option>
          )}
        </select>

        <Button color='red-700' onClick={() => onRemove(idx)}>
          Remove
        </Button>
      </div>

      {!isImage && type !== 'divider' &&
        <Input id={`text-${idx}`}
               value={text || ''}
               onChange={value => onChange(idx, 'text', value)}
               type='textarea'
               rows={rows} />
      }

      {isImage &&
        <Input id={`image-${idx}`}
               onChange={value => onChange(idx, 'image', value)}
               label='File'
               type='file' />
      }
    </div>
  )
}

const file = (original) => {
  if (!original) return null

  const name = Math.random().toString(36).substring(2, 13)

  return new File([original], name, { type: original.type })
}

export const getFormData = (title, urlSlug, tags, content, titleImage) => {
  const formData = new FormData

  const mappedContent = content.map(c => {
    if (c.image instanceof File) {
      const image = file(c.image)

      formData.append('post[images]', image)
      return { ...c, image: image.name }
    } else {
      return c
    }
  })

  formData.append('post[title]', title)
  formData.append('post[urlSlug]', urlSlug)
  formData.append('post[tags]', tags)
  formData.append('post[titleImage]', file(titleImage))
  formData.append('post[content]', JSON.stringify(mappedContent))

  return formData
}

export const normalizeUrlSlug = (string) => (
  string.toLowerCase().replace(/[^a-z0-9\s\-+]/ig, '').replace(/\s+/g, '-')
)
