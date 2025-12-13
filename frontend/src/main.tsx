import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("APP_BOOT_OK - main.tsx loaded");

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log("APP_BOOT_OK - root element found, rendering App");
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("APP_BOOT_ERROR - root element not found!");
}
