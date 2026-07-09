import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const originalFetch = window.fetch;
window.fetch = async function () {
  let [resource, config] = arguments;
  if (typeof resource === 'string' && resource.includes('/api/')) {
    config = config || {};
    const token = localStorage.getItem('sentiNautToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
  }
  return originalFetch(resource, config);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "123456789-mockclientid.apps.googleusercontent.com"}>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
