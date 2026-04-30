import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { FriendshipProvider } from './contexts/FriendshipContext.tsx'
import { PostProvider } from './contexts/PostContext.tsx'
import { NotificationProvider } from './contexts/NotificationContext.tsx'
import { StoryProvider } from './contexts/StoryContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <FriendshipProvider>
            <StoryProvider>
              <PostProvider>
                <App />
              </PostProvider>
            </StoryProvider>
          </FriendshipProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
