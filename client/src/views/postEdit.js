import React, { useState, useContext, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'

import { Button, Input, ContentBlock, SecretInput, getFormData, normalizeUrlSlug, contentBlock } from '../components/formComponents'
import { getPost, updatePost, publishPost, unpublishPost, deletePost } from '../utils/apiRequests'
import { componentMap } from '../components/blogBlocks'
import Image from '../components/image'

const PostEdit = () => {
  const history  = useHistory()
  const { slug } = useParams()
  const { isLoading, error, data } = useQuery('post', () => getPost(slug))
  const contentImages = useRef({})

  const post = data || {}

  const [title, setTitle]           = useState('')
  const [urlSlug, setUrlSlug]       = useState('')
  const [tags, setTags]             = useState('')
  const [content, setContent]       = useState([])
  const [titleImage, setTitleImage] = useState(null)
  const [published, setPublished]   = useState(false)

  const mutation = useMutation(updatePost, {
    onError: () => alert('Save failed :(')
  })

  const publishMutation = useMutation(publishPost, {
    onSuccess: ({ isPublished }) => setPublished(isPublished),
    onError: () => alert('Publishing failed :(')
  })

  const unpublishMutation = useMutation(unpublishPost, {
    onSuccess: ({ isPublished }) => setPublished(isPublished),
    onError: () => alert('Unpublishing failed :(')
  })

  const deleteMutation = useMutation(deletePost, {
    onSuccess: () => history.push('/posts'),
    onError: () => alert('Deletion failed :(')
  })

  useEffect(() => {
    if (post.id) {
      setTitle(post.title)
      setUrlSlug(post.urlSlug)
      setTags(post.tags.join(', '))
      setContent(post.content)
      setPublished(post.isPublished)
    }
  }, [post.id])

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
      { id: post.id, data: getFormData(title, urlSlug, tags, titleImage, content, contentImages.current) }
    )
  }

  const visitPost = () => {
    window.open(`/posts/${urlSlug}`, '_blank').focus()
  }

  const renderContentBlock = (block) => (
    <div key={block.uid}>
      <ContentBlock {...block}
                    idx={block.uid}
                    onChange={changeContent}
                    onRemove={removeContent} />

      {block.image && <Image className='my-5' src={block.image} />}
    </div>
  )

  const renderPublishButton = () => {
    if (published) {
      return <Button color='blue-700' onClick={() => unpublishMutation.mutate(post.id)} className='mt-5 w-30 block ml-3'>Unpublish</Button>
    } else {
      return <Button color='blue-700' onClick={() => publishMutation.mutate(post.id)} className='mt-5 w-30 block ml-3'>Publish</Button>
    }
  }

  return (
    <div className='blog'>
      <div className='container text-container'>
        <div className='flex'>
          <Button color='gray-700' onClick={visitPost} className='mt-5 w-30 block ml-auto'>Preview</Button>
          {renderPublishButton()}
          <Button color='red-700' onClick={() => deleteMutation.mutate(post.id)} className='mt-5 w-30 block ml-3'>Delete</Button>
        </div>

        <SecretInput />

        <Input id='title' value={title} onChange={setTitle} label='Title' errors={mutation.error?.errors} />
        <Input id='urlSlug' value={urlSlug} onChange={setUrlSlug} label='URL slug' errors={mutation.error?.errors} />
        <Input id='tags' value={tags} onChange={setTags} label='Tags' errors={mutation.error?.errors} />

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
