import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { init } from '@sentry/react'

import Application from './components/application'

import './styles/application.css'
import 'highlight.js/styles/github-gist.css'

const environment = process.env.NODE_ENV

if (process.env.NODE_ENV === 'production') {
  init({
    environment: process.env.NODE_ENV,
    dsn: 'https://cef620f22b8c4d1d94a6d6a69b26a9fd@o502416.ingest.sentry.io/5584774'
  })
}

const queryClient = new QueryClient()

ReactDOM.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Application />
    </QueryClientProvider>
  </BrowserRouter>,
  document.getElementById('blog')
)
