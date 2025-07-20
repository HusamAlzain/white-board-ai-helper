import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/globals.css'

// This file is needed for Vite compatibility in the development environment
// The actual Next.js app runs from src/app/page.tsx
function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Development Mode</h1>
        <p className="text-muted-foreground">
          This project runs on Next.js. Use <code>npm run dev</code> to start the Next.js development server.
        </p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)