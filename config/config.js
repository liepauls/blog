module.exports = {
  development: {
    database: 'blog_development',
    host: 'localhost',
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  UPLOAD_DESTINATION: 'public/uploads'
}
