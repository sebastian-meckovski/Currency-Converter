import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import CurrencyConverter from './CurrencyConverter';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<CurrencyConverter />
	</React.StrictMode>
);
