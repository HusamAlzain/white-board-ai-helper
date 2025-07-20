import React from 'react'
import ReactDOM from 'react-dom/client'
import './app/globals.css'

// Development compatibility layer for Vite
// This redirects to Next.js structure when running in development
function DevApp() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Development Mode</h1>
          <p className="text-muted-foreground mb-4">
            This project runs on Next.js. Please use:
          </p>
          <code className="bg-muted p-2 rounded text-sm">npm run dev</code>
          <p className="text-sm text-muted-foreground mt-4">
            The development server will start on port 3000
          </p>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevApp />
  </React.StrictMode>,
)