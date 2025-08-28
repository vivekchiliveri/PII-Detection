 import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PIIDetectorProvider } from './context/PIIDetectorContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PIIDetectorProvider>
      <App />
    </PIIDetectorProvider>
  </React.StrictMode>,
);
