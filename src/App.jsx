import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

export const App = () => {
  return <div>App, idon't know, Do you know that?</div>
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
