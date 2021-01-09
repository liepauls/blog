import React, { useState, useEffect, useRef } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'

import { componentMap } from '../components/blogBlocks'
import { Button, Input, ContentBlock, SecretInput, getFormData, normalizeUrlSlug, contentBlock } from '../components/formComponents'
import { createPost } from '../utils/apiRequests'

const PostNew = () => {
  const contentImages = useRef({})
  const history  = useHistory()
  const mutation = useMutation(createPost, {
    onSuccess: ({ urlSlug }) => {
      history.push(`/posts/${urlSlug}/edit`)
    },
    onError: () => alert('Save failed :(')
  })

  const [title, setTitle]           = useState('')
  const [urlSlug, setUrlSlug]       = useState('')
  const [tags, setTags]             = useState('')
  const [content, setContent]       = useState([contentBlock()])
  const [titleImage, setTitleImage] = useState(null)

  useEffect(() => {
    if (title) {
      setUrlSlug(normalizeUrlSlug(title))
    }
  }, [title])

  const changeContent = (uid, property, value) => {
    const newContent = [...content]
    const block      = newContent.find(b => b.uid === uid)

    if (property === 'image') {
      contentImages.current[uid] = value
    } else {
      newContent.find(b => b.uid === uid)[property] = value
    }

    setContent(newContent)
  }

  const addContent = () => {
    setContent([...content, contentBlock()])
  }

  const removeContent = (uid) => {
    setContent(content.filter((block) => block.uid !== uid))
  }

  const submit = async () => {
    mutation.mutate(
      getFormData(title, urlSlug, tags, titleImage, content, contentImages.current)
    )
  }

  const renderContentBlock = (block) => (
    <ContentBlock {...block}
                  key={block.uid}
                  onChange={changeContent}
                  onRemove={removeContent} />
  )

  return (
    <div className='blog'>
      <div className='container text-container pb-8 md:pb-12'>
        <SecretInput />

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
