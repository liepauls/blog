import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import Application from './components/application'

import './styles/application.scss'

const queryClient = new QueryClient()

ReactDOM.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Application />
    </QueryClientProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
