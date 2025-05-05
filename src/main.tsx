
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to safely load the application
const loadApp = () => {
  // Make sure we have a root element to mount to
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    // Make sure to wrap the App in React.StrictMode for better error detection
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error("Failed to find the root element");
  }
}

// In case the DOM isn't fully loaded yet
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadApp);
} else {
  loadApp();
}
