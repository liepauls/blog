const aws  = require('aws-sdk')
const uuid = require('uuid')

aws.config.update({
  accessKeyId:     process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region:          process.env.S3_REGION
})

const s3 = new aws.S3()

class Image {
  constructor(key) {
    this.key = key
  }

  static persist(file) {
    if (!file) return

    const filename = uuid.v4()

    s3.putObject({
      Bucket:      process.env.S3_BUCKET,
      Key:         filename,
      Body:        file.buffer,
      ContentType: file.mimetype
    }, console.log)

    return filename
  }

  getUrl() {
    if (!this.key) return

    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${this.key}`
  }
}

module.exports = Image
