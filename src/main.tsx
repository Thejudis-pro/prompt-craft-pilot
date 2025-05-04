
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to safely load the application
const loadApp = () => {
  // Make sure we have a root element to mount to
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
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
