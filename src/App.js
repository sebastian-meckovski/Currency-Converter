import './App.scss';
import Combobox from 'react-widgets/Combobox';
import 'react-widgets/scss/styles.scss';
import { useState, useEffect } from 'react';

const renderListItem = (x) => {
	return <p>{x.item.longName}</p>;
};

function App() {
	const [currencies, setCurrencies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [baseCurrency, setBaseCurrency] = useState();
	const [counterCurrency, setCounterCurrency] = useState();
	const [rates, setRates] = useState();
	const [conversionRate, setConversionRate] = useState(null);
	const [value, setValue] = useState(100);
	const [string, setString] = useState('');

	useEffect(() => {
		const fetchCurrencies = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch('https://openexchangerates.org/api/currencies.json');
				const data = await response.json();
				let result = [];
				for (let currency in data) {
					result.push({ currency, name: data[currency], longName: currency + ' - ' + data[currency] });
				}
				setCurrencies(result);
				setBaseCurrency(result[49]);
				setCounterCurrency(result[46]);
			} catch (e) {
				console.log(e);
				setError(e);
			} finally {
				setLoading(false);
			}
		};

		fetchCurrencies();
	}, []);

	useEffect(() => {
		const fetchConversion = async () => {
			setError(null);
			try {
				const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency.currency}`);
				const data = await response.json();
				setRates(data.rates);
			} catch (e) {
				setError(e);
				console.log(e);
			}
		};
		fetchConversion();
	}, [baseCurrency]);

	useEffect(() => {
		if (rates && counterCurrency) {
			setConversionRate(rates[counterCurrency.currency]);
		}
	}, [counterCurrency, rates]);

	useEffect(() => {
		if (baseCurrency && conversionRate && counterCurrency && value) {
			setString(` ${value}  ${baseCurrency.currency} is equivalent to ${(conversionRate * value).toFixed(2)} ${counterCurrency.currency}`);
		}
	}, [baseCurrency, conversionRate, counterCurrency, value]);

	return (
		<div className="App">
			<input
				type={'number'}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
			/>
			<Combobox
				placeholder="Select Currency..."
				filter="contains"
				busy={loading}
				dataKey={'longName'}
				data={currencies}
				renderListItem={renderListItem}
				textField={'longName'}
				onChange={(value) => setBaseCurrency(value)}
				value={baseCurrency}
			/>
			<Combobox
				placeholder="Select Currency..."
				filter="contains"
				busy={loading}
				dataKey={'longName'}
				data={currencies}
				renderListItem={renderListItem}
				textField={'longName'}
				onChange={(value) => setCounterCurrency(value)}
				value={counterCurrency}
			/>
			<p>{string}</p>
			{error && <p>something went wrong...</p>}
		</div>
	);
}

export default App;
