const fs      = require('fs')
const multer  = require('multer')
const uploads = multer({ storage: multer.memoryStorage() })

const { UPLOAD_DESTINATION } = require('../config/config')

const ensureUploadDirectory = () => {
  let path = ''
  UPLOAD_DESTINATION.split('/').forEach(part => {
    path += `${part}/`

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  })
}

const persistImage = (image) => {
  if (!image) return

  ensureUploadDirectory()

  fs.writeFile(
    `${UPLOAD_DESTINATION}/${image.originalname}`,
    image.buffer,
    null,
    () => console.log('wrote file', image.originalname)
  )

  return image.originalname
}

const parsePostParams = ({ files, body }) => {
  const { title, content, tags, urlSlug } = body.post

  files['post[images]']?.forEach(i => persistImage(i))

  return {
    titleImage: persistImage(files['post[titleImage]'] && files['post[titleImage]'][0]),
    content:    JSON.parse(content),
    title:      title ? title : null,
    urlSlug:    urlSlug ? urlSlug : null,
    tags:       tags.split(', ')
  }
}

const getUploads = () => (
  uploads.fields([{ name: 'post[titleImage]' }, { name: 'post[images]' }])
)

module.exports = { parsePostParams, getUploads }
