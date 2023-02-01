import './App.scss';
import Combobox from 'react-widgets/Combobox';
import 'react-widgets/scss/styles.scss';
import { useState, useEffect } from 'react';
import {ComboBox as ComboBoxComponent} from './ComboBox'

const renderListItem = (x) => {
	let src = x.item.currency.slice(0, 2).toLowerCase();
	return (
		<div key={x.item.currency} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
			<img src={`https://flagcdn.com/${src}.svg`} width="48" height="32" alt=""></img>
			<p>{x.item.longName}</p>
		</div>
	);
};

function App() {
	const [currencies, setCurrencies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [baseCurrency, setBaseCurrency] = useState(null);
	const [counterCurrency, setCounterCurrency] = useState(null);
	const [rates, setRates] = useState(null);
	const [conversionRate, setConversionRate] = useState(null);
	const [value, setValue] = useState(100);
	const [string, setString] = useState('');
	const [display, setDisplay] = useState(false);
	const [time, setTime] = useState(null);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime((prevTime) => prevTime - 1);
		}, 1000);

		if (time === 0) {
			setDisplay(false);
			setString(null);
		}
		return () => clearInterval(intervalId);
	}, [time]);

	useEffect(() => {
		const fetchCurrencies = async () => {
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
				setError(e);
			} finally {
				setLoading(false);
			}
		};

		fetchCurrencies();
	}, []);

	const fetchConversion = async () => {
		setError(null);
		try {
			const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency.currency}`);
			const data = await response.json();
			setRates(data.rates);
		} catch (e) {
			setError(e);
		}
	};

	useEffect(() => {
		if (rates && counterCurrency) {
			setConversionRate(rates[counterCurrency.currency]);
			setDisplay(true);
			setTime(60);
		}
	}, [rates]);

	const handleSwap = () => {
		setDisplay(false);
		setRates(null);
		setBaseCurrency(counterCurrency);
		setCounterCurrency(baseCurrency);
	};

	useEffect(() => {
		if (baseCurrency && conversionRate && counterCurrency && value && display) {
			setString(`${value}  ${baseCurrency.currency} is equivalent to ${(conversionRate * value).toFixed(2)} ${counterCurrency.currency}`);
		} else {
			setString(null);
		}
	}, [baseCurrency, conversionRate, counterCurrency, value, display]);

	return (
		<div className="App">
			<input
				type={'number'}
				value={value}
				onChange={(e) => {
					setDisplay(false);
					setConversionRate(null);
					setValue(e.target.value);
				}}
			/>
			<button onClick={handleSwap}>SWAP</button>

			<Combobox
				placeholder="Select Currency..."
				filter="contains"
				busy={loading}
				dataKey={'longName'}
				data={currencies}
				renderListItem={renderListItem}
				textField={'longName'}
				onChange={(value) => {
					setBaseCurrency(value);
					setDisplay(false);
				}}
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
				onChange={(value) => {
					setCounterCurrency(value);
					setDisplay(false);
				}}
				value={counterCurrency}
			/>
			{/* <ComboBoxComponent/> */}
			{display && string && (
				<p>
					Expires in: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
				</p>
			)}
			{string && display && <p>{string}</p>}
			{error && <p>something went wrong...</p>}
			<button onClick={fetchConversion}>Convert</button>
		</div>
	);
}

export default App;
