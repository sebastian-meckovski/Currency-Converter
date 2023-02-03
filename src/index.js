import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import CurrencyConverter from './CurrencyConverter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CurrencyConverter />
  </React.StrictMode>
);
