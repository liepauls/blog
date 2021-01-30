import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { init } from '@sentry/react'

const environment = process.env.NODE_ENV

init({
  environment,
  dsn: 'https://cef620f22b8c4d1d94a6d6a69b26a9fd@o502416.ingest.sentry.io/5584774',
  beforeSend: (event) => environment === 'production' && event
})

import Application from './components/application'

import './styles/application.css'
import 'highlight.js/styles/github-gist.css'

const queryClient = new QueryClient()

ReactDOM.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Application />
    </QueryClientProvider>
  </BrowserRouter>,
  document.getElementById('blog')
)
