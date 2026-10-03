import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MotionPreferenceProvider } from './lib/motionPreference';
import './styles/index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <MotionPreferenceProvider>
      <App />
    </MotionPreferenceProvider>
  </StrictMode>,
);
