import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'

import { componentMap } from '../components/blogBlocks'
import { Button, Input, ContentBlock, getFormData, normalizeUrlSlug } from '../components/formComponents'
import { createPost } from '../utils/apiRequests'

const PostNew = () => {
  const [title, setTitle]           = useState('')
  const [urlSlug, setUrlSlug]       = useState('')
  const [tags, setTags]             = useState('')
  const [content, setContent]       = useState([{ type: 'text' }])
  const [titleImage, setTitleImage] = useState(null)

  const history  = useHistory()
  const mutation = useMutation(createPost, {
    onSuccess: ({ urlSlug }) => {
      history.push(`/posts/${urlSlug}/edit`)
    },
    onError: () => alert('Save failed :(')
  })

  useEffect(() => {
    if (title) {
      setUrlSlug(normalizeUrlSlug(title))
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

  const submit = async () => {
    mutation.mutate(
      getFormData(title, urlSlug, tags, content, titleImage)
    )
  }

  const renderContentBlock = (cntn, idx) => (
    <ContentBlock {...cntn}
                  key={idx}
                  idx={idx}
                  onChange={changeContent}
                  onRemove={removeContent} />
  )

  return (
    <div className='blog'>
      <div className='container text-container'>
        <Input id='title' value={title} onChange={setTitle} label='Title' errors={mutation.error?.errors} />
        <Input id='urlSlug' value={urlSlug} onChange={setUrlSlug} label='URL slug' errors={mutation.error?.errors} />
        <Input id='tags' value={tags} onChange={setTags} label='Tags' errors={mutation.error?.errors} />

        <Input id='titleImage' label='Title image' type='file' onChange={setTitleImage} />

        {content.map(renderContentBlock)}

        <Button color='blue-700' onClick={addContent} className='mt-5 w-52 block mx-auto'>Add content block</Button>
        <Button color='green-700' onClick={submit} className='mt-5 w-52 block mx-auto'>Save</Button>
      </div>
    </div>
  )
}

export default PostNew
