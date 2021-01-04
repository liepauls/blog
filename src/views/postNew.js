import React, { useState, useRef, useEffect } from 'react'
import { useMutation } from 'react-query'

import { componentMap } from '../components/blogBlocks'
import { createPost } from '../utils/apiRequests'

const Button = ({ children, color, onClick, className }) => (
  <button className={`border px-5 py-2 rounded-md border-${color} text-${color} ${className}`} onClick={onClick}>
    {children}
  </button>
)

const Input = React.forwardRef(({ id, value, onChange, label, type, rows, errors = [] }, ref) => {
  const Component = type === 'textarea' ? 'textarea' : 'input'
  const className = type === 'file' ? 'py-1' : 'border-gray-300 border rounded-md block w-full py-1 px-2'
  const error     = errors.find(e => e.path === id)

  return (
    <div className='my-4'>
      {label && <label htmlFor={id} className='block mb-1'>{label}</label>}
      <Component id={id}
                 className={className}
                 value={value}
                 onChange={e => onChange && onChange(e.target.value)}
                 type={type}
                 ref={ref}
                 rows={rows} />
      {error && <div className='text-red-700'>{error.message}</div>}
    </div>
  )
})

const ContentBlock = React.forwardRef(({ type, image, text, onChange, onRemove, idx }, ref) => {
  const isImage = type === 'image'
  const rows    = type === 'header' ? 1 : 6

  return (
    <div className='border p-3 pb-0 rounded-md border-gray-300 mt-5'>
      <div className='flex'>
        <select className='border-gray-300 border rounded-md block w-full py-1 px-2 mr-5'
                value={type}
                onChange={e => onChange(idx, 'type', e.target.value)}>
          <option value=''></option>
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

      {isImage && <Input id={`image-${idx}`} ref={ref} label='File' type='file' />}
    </div>
  )
})

const PostNew = () => {
  const [title, setTitle]     = useState('')
  const [urlSlug, setUrlSlug] = useState('')
  const [tags, setTags]       = useState('')
  const [content, setContent] = useState([{ type: 'text' }])

  const mutation      = useMutation(createPost)
  const errors        = mutation.data?.errors
  const titleImageRef = useRef(null)
  const imageRefs     = useRef([])

  useEffect(() => {
    if (title) {
      setUrlSlug(title.toLowerCase().replace(/\s+/g, '-'))
    }
  }, [title])

  const changeContent = (i, property, value) => {
    const newContent = [...content]
    newContent[i][property] = value
    setContent(newContent)
  }

  const addContent = () => {
    setContent([...content, { type: 'text' }])
  }

  const removeContent = (idx) => {
    setContent(content.filter((_, i) => i !== idx))
  }

  const submit = () => {
    const formData = new FormData

    formData.append('post[title]', title)
    formData.append('post[urlSlug]', urlSlug)
    formData.append('post[tags]', tags)
    formData.append('post[titleImage]', titleImageRef.current.files[0])
    formData.append('post[content]', JSON.stringify(content))

    imageRefs.current.forEach(input => formData.append('post[images]', input?.files[0]))

    mutation.mutate(formData)
  }

  const renderContentBlock = (cntn, idx) => (
    <ContentBlock {...cntn}
                  key={idx}
                  idx={idx}
                  onChange={changeContent}
                  onRemove={removeContent}
                  ref={el => imageRefs.current[idx] = el} />
  )

  return (
    <div className='blog'>
      <div className='container text-container'>
        <Input id='title' value={title} onChange={setTitle} label='Title' errors={errors} />
        <Input id='urlSlug' value={urlSlug} onChange={setUrlSlug} label='URL slug' errors={errors} />
        <Input id='tags' value={tags} onChange={setTags} label='Tags' errors={errors} />

        <Input id='titleImage' label='Title image' type='file' ref={titleImageRef} />

        {content.map(renderContentBlock)}

        <Button color='blue-700' onClick={addContent} className='mt-5 w-52 block mx-auto'>Add content</Button>
        <Button color='green-700' onClick={submit} className='mt-5 w-52 block mx-auto'>Save</Button>
      </div>
    </div>
  )
}

export default PostNew
