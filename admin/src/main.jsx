import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './admin.css';
import App from './App.jsx';
import { applyContent } from '../../src/config/wedding';

// Pages like Invite Links read the card's details, so load the admin's saved copy before the first render
fetch('/api/card')
  .then((r) => (r.ok ? r.json() : null))
  .then((saved) => saved && applyContent(saved))
  .catch(() => {})
  .finally(() =>
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <BrowserRouter basename="/admin">
          <App />
        </BrowserRouter>
      </StrictMode>,
    ),
  );
