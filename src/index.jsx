import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigError } from './components/ConfigError';
import { supabaseConfigured } from './lib/supabase';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  supabaseConfigured
    ? <App />
    : <ConfigError />
);
