import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const Router = window.location.hostname.endsWith('github.io') ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#111111',
                color: '#f5f1e8',
                border: '1px solid rgba(200, 169, 107, 0.2)',
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
