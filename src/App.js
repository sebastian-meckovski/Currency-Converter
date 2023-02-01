import './App.scss';
import { useState, useEffect } from 'react';
import { ComboBox as ComboBoxComponent } from './ComboBox';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const listItemRender = (item) => {
	let src = item.currency.slice(0, 2).toLowerCase();

	return (
		<div key={item.currency} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', margin: '0.75rem 0.25rem' }}>
			<img src={`https://flagcdn.com/${src}.svg`} width="48" height="32" alt=""></img>
			<p>{item.longName}</p>
		</div>
	);
};

function App() {
	const [inputValue, setInputValue] = useState(null);
	const [inputValue1, setInputValue1] = useState(null);
	const [currencies, setCurrencies] = useState([]);
	const [filteredCurrencies, setFilteredCurrencies] = useState();
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

	const onDropdownClosed = () => {
		baseCurrency && setInputValue(baseCurrency.longName);
		setFilteredCurrencies(currencies);
	};

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
				setFilteredCurrencies(result);
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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rates]);

	const handleSwap = () => {
		setDisplay(false);
		setRates(null);
		setBaseCurrency(counterCurrency);
		setCounterCurrency(baseCurrency);
	};

	useEffect(() => {
		if (baseCurrency && conversionRate && counterCurrency && value && display) {
			setString(`${value}  ${baseCurrency.currency} is equivalent to ${(conversionRate * value).toFixed(0)} ${counterCurrency.currency}`);
		} else {
			setString(null);
		}
	}, [baseCurrency, conversionRate, counterCurrency, value, display]);

	useEffect(() => {
		baseCurrency && setInputValue(baseCurrency.longName);
		counterCurrency && setInputValue1(counterCurrency.longName);
	}, [baseCurrency, counterCurrency]);

	return (
		<div className="App">
			<div className="inputWrapper">
				<p>Amount</p>
				<div className="Amount">
					<input
						className="input"
						type="number"
						value={value}
						onChange={(e) => {
							setDisplay(false);
							setConversionRate(null);
							setValue(e.target.value);
						}}
					/>
					<button className="swapButton" onClick={handleSwap}>
						<FontAwesomeIcon icon={faExchangeAlt} />{' '}
					</button>
				</div>
			</div>
			<ComboBoxComponent
				dataSource={filteredCurrencies}
				listItemRender={listItemRender}
				onItemClick={(e, item) => {
					setBaseCurrency(item);
					item && setInputValue(item.longName);
					setDisplay(false);
					setString(null);
				}}
				onInputChange={(e) => {
					setInputValue(e.target.value);
					const newData = currencies.filter((x) => x.longName.toLowerCase().includes(e.target.value.toLowerCase()));
					setFilteredCurrencies(newData);
				}}
				inputValue={inputValue}
				onDropdownClosed={onDropdownClosed}
				selectedValue={baseCurrency}
				isLoading={loading}
			/>

			<br></br>

			<ComboBoxComponent
				dataSource={filteredCurrencies}
				listItemRender={listItemRender}
				onItemClick={(x, item) => {
					setCounterCurrency(item);
					item && setInputValue1(item.longName);
					setDisplay(false);
					setString(null);
				}}
				onInputChange={(e) => {
					setInputValue1(e.target.value);
					const newData = currencies.filter((x) => x.longName.toLowerCase().includes(e.target.value.toLowerCase()));
					setFilteredCurrencies(newData);
				}}
				inputValue={inputValue1}
				onDropdownClosed={() => {
					counterCurrency && setInputValue1(counterCurrency.longName);
					setFilteredCurrencies(currencies);
				}}
				selectedValue={counterCurrency}
				isLoading={loading}
			/>
			<div className="conversionMessage">{string && display && <p >{string}</p>}</div>

			{display && string && (
				<div className="timer">
					<p>Expires in:</p>

					<p>{Math.floor(time / 60)}'</p>
					<p>{(time % 60).toString().padStart(2, '0')}''</p>
				</div>
			)}
			<button className="convertButton" onClick={fetchConversion}>
				Convert
			</button>
			{error && <p>something went wrong...</p>}
		</div>
	);
}

export default App;
