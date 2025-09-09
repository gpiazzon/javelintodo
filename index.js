import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './react-app.js';
import ErrorBoundary from './ErrorBoundary.js';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
