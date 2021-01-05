import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'

import { Button, Input, ContentBlock, getFormData, normalizeUrlSlug } from '../components/formComponents'
import { getPost, updatePost, publishPost, unpublishPost, deletePost } from '../utils/apiRequests'
import { componentMap } from '../components/blogBlocks'
import Image from '../components/image'

const PostEdit = () => {
  const { slug } = useParams()
  const { isLoading, error, data } = useQuery('post', () => getPost(slug))

  const [title, setTitle]           = useState('')
  const [urlSlug, setUrlSlug]       = useState('')
  const [tags, setTags]             = useState('')
  const [content, setContent]       = useState([{ type: 'text' }])
  const [titleImage, setTitleImage] = useState(null)

  const mutation = useMutation(updatePost)
  const errors   = mutation.data?.errors
  const post     = data || {}

  const publishMutation   = useMutation(publishPost)
  const unpublishMutation = useMutation(unpublishPost)
  const deleteMutation    = useMutation(deletePost)

  useEffect(() => {
    if (post.id) {
      setTitle(post.title)
      setUrlSlug(post.urlSlug)
      setTags(post.tags.join(', '))
      setContent(post.content)
    }
  }, [post.id])

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

  const submit = () => {
    getFormData(title, urlSlug, tags, content, titleImage)

    mutation.mutate(
      { id: post.id, data: getFormData(title, urlSlug, tags, content, titleImage) }
    )
  }

  const renderContentBlock = (cntn, idx) => (
    <div key={idx}>
      <ContentBlock {...cntn}
                    idx={idx}
                    onChange={changeContent}
                    onRemove={removeContent} />

      {cntn.image && <Image className='my-5' src={cntn.image} />}
    </div>
  )

  const renderPublishButton = () => {
    if (post.isPublished) {
      return <Button color='blue-700' onClick={() => unpublishMutation.mutate(post.id)} className='mt-5 w-30 block ml-auto'>Unpublish</Button>
    } else {
      return <Button color='blue-700' onClick={() => publishMutation.mutate(post.id)} className='mt-5 w-30 block ml-auto'>Publish</Button>
    }
  }

  return (
    <div className='blog'>
      <div className='container text-container'>
        <div className='flex'>
          {renderPublishButton()}
          <Button color='red-700' onClick={() => deleteMutation.mutate(post.id)} className='mt-5 w-30 block ml-3'>Delete</Button>
        </div>

        <Input id='title' value={title} onChange={setTitle} label='Title' errors={errors} />
        <Input id='urlSlug' value={urlSlug} onChange={setUrlSlug} label='URL slug' errors={errors} />
        <Input id='tags' value={tags} onChange={setTags} label='Tags' errors={errors} />

        <Input id='titleImage' label='Title image' type='file' onChange={setTitleImage} />
        {post.titleImage && <Image className='mb-10' src={post.titleImage} />}

        {content.map(renderContentBlock)}

        <Button color='blue-700' onClick={addContent} className='mt-5 w-52 block mx-auto'>Add content block</Button>
        <Button color='green-700' onClick={submit} className='mt-5 w-52 block mx-auto'>Save</Button>
      </div>
    </div>
  )
}

export default PostEdit
