module.exports = {
  development: {
    database: 'blog_development',
    host: 'localhost',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  },
  UPLOAD_DESTINATION: 'public/uploads'
}
