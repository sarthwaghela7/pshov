import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/globals.css';

const directAdminPath = window.location.pathname;

// Keep hash routes for static-host refresh support, while making a typed
// `/admin` URL open the admin panel as expected.
if (directAdminPath === '/admin' || directAdminPath.startsWith('/admin/')) {
  const appBasePath = directAdminPath.replace(/\/admin(?:\/.*)?$/, '/');
  window.location.replace(`${appBasePath}#/admin`);
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>,
  );
}
