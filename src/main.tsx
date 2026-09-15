import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CrmProvider } from './context/CrmContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CrmProvider>
      <App />
    </CrmProvider>
  </StrictMode>,
);

