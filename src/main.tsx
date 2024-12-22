import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize Supabase client
import './lib/supabase';

// Base Tailwind styles
import './index.css';

// Disable React.StrictMode in development to prevent double-mounting
const StrictMode = import.meta.env.PROD ? React.StrictMode : React.Fragment;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
