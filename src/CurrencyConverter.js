import './CurrencyConverter.scss';
import { useState, useEffect, useRef } from 'react';
import { ComboBox as ComboBoxComponent } from 'seb-components-library';
import { faExchangeAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import exclusionList from './data/exclusionList';
import { listItemRender, calculateRate, isValidNumber } from './utils';

function CurrencyConverter() {
  const [baseCurrencyInputValue, setBaseCurrencyInputValue] = useState(null);
  const [counterCurrencyInputValue, setCounterCurrencyInputValue] = useState(null);
  const [filteredCurrencies, setFilteredCurrencies] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState(null);
  const [counterCurrency, setCounterCurrency] = useState(null);
  const [rates, setRates] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [amount, setAmount] = useState('100');
  const [conversionString, setConversionString] = useState('');
  const [display, setDisplay] = useState(false);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState({ loadingDropdown: true, loadingCoversion: false });
  const [validationMessage, setValidationMessage] = useState(null);
  const currencies = useRef(null);

  const fetchConversion = async () => {
    setError(null);
    try {
      setLoading((prev) => {
        return { ...prev, loadingCoversion: true };
      });
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency.currency}`);
      const data = await response.json();
      setRates(data.rates);
    } catch (e) {
      setError(e);
    } finally {
      setLoading((prev) => {
        return { ...prev, loadingCoversion: false };
      });
    }
  };

  const handleSwap = () => {
    setDisplay(false);
    setRates(null);
    setBaseCurrency(counterCurrency);
    setCounterCurrency(baseCurrency);
  };

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('https://openexchangerates.org/api/currencies.json');
      const data = await response.json();
      let result = [];
      for (let currency in data) {
        if (!exclusionList.includes(currency)) {
          result.push({ currency, name: data[currency], searchName: `${currency} ${data[currency]}` });
        }
      }
      currencies.current = result;
      setFilteredCurrencies(result);
      setBaseCurrency(result.find((x) => x.currency === 'GBP') !== undefined ? result.find((x) => x.currency === 'GBP') : result[0]);
      setCounterCurrency(result.find((x) => x.currency === 'EUR') !== undefined ? result.find((x) => x.currency === 'EUR') : result[1]);
    } catch (e) {
      setError(e);
    } finally {
      setLoading((prev) => {
        return { ...prev, loadingDropdown: false };
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchConversion();
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      display && !validationMessage && setTime((prevTime) => prevTime - 1);
    }, 1000);

    if (time === 0) {
      setDisplay(false);
      setConversionString(null);
    }
    return () => clearInterval(intervalId);
  }, [time, display, validationMessage]);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (rates && counterCurrency) {
      setConversionRate(rates[counterCurrency.currency]);
      setDisplay(true);
      setTime(600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates]);

  useEffect(() => {
    if (baseCurrency && conversionRate && counterCurrency && amount && display) {
      setConversionString(`${amount}  ${baseCurrency.currency} is equivalent to ${calculateRate(conversionRate, amount)} ${counterCurrency.currency}`);
    } else {
      setConversionString(null);
    }
  }, [baseCurrency, conversionRate, counterCurrency, amount, display]);

  useEffect(() => {
    baseCurrency && setBaseCurrencyInputValue(baseCurrency.searchName);
    counterCurrency && setCounterCurrencyInputValue(counterCurrency.searchName);
  }, [baseCurrency, counterCurrency]);

  useEffect(() => {
    if (isValidNumber(amount)) {
      setValidationMessage(null);
    } else if (amount === '') {
      setValidationMessage('Please enter a value');
    } else {
      setValidationMessage(`${amount} is not a valid nubmer`);
    }
  }, [amount]);

  return (
    <div className="currencyConverter">
      <div className="currencyConverter__inputWrapper">
        <p>Amount</p>
        <div className="currencyConverter__inputWrapper__amount">
          <input
            onKeyDown={handleKeyDown}
            className="currencyConverter__inputWrapper__amount__input"
            value={amount}
            onChange={(e) => {
              setDisplay(false);
              setConversionRate(null);
              setAmount(e.target.value);
            }}
          />
          <button className="currencyConverter__inputWrapper__amount__swapButton" aria-label="swap" onClick={handleSwap}>
            <FontAwesomeIcon icon={faExchangeAlt} />{' '}
          </button>
        </div>
      </div>
      <ComboBoxComponent
        dataSource={filteredCurrencies}
        listItemRender={listItemRender}
        onItemClick={(e, item) => {
          item && setBaseCurrency(item);
          item && setBaseCurrencyInputValue(item.searchName);
          setDisplay(false);
          setConversionString(null);
        }}
        onInputChange={(e) => {
          setBaseCurrencyInputValue(e.target.value);
          const newData = currencies.current.filter((x) => x.searchName.toLowerCase().includes(e.target.value.toLowerCase()));
          setFilteredCurrencies(newData);
        }}
        inputValue={baseCurrencyInputValue}
        onDropdownClosed={() => {
          baseCurrency && setBaseCurrencyInputValue(baseCurrency.searchName);
          setFilteredCurrencies(currencies.current);
        }}
        selectedValue={baseCurrency}
        isLoading={loading.loadingDropdown}
        EmptyResultMessage={'No Currencies Found'}
        placeholder={'Enter currency...'}
        ariaKey={'name'}
        buttonDropDownAriaKey={'name'}
      />
      <ComboBoxComponent
        dataSource={filteredCurrencies}
        listItemRender={listItemRender}
        onItemClick={(x, item) => {
          item && setCounterCurrency(item);
          item && setCounterCurrencyInputValue(item.searchName);
          setDisplay(false);
          setConversionString(null);
        }}
        onInputChange={(e) => {
          setCounterCurrencyInputValue(e.target.value);
          const newData = currencies.current.filter((x) => x.searchName.toLowerCase().includes(e.target.value.toLowerCase()));
          setFilteredCurrencies(newData);
        }}
        inputValue={counterCurrencyInputValue}
        onDropdownClosed={() => {
          counterCurrency && setCounterCurrencyInputValue(counterCurrency.searchName);
          setFilteredCurrencies(currencies.current);
        }}
        selectedValue={counterCurrency}
        isLoading={loading.loadingDropdown}
        EmptyResultMessage={'No Currencies Found'}
        placeholder={'Enter currency...'}
        ariaKey={'name'}
        buttonDropDownAriaKey={'name'}
      />
      <div data-testid="test-convert" className="currencyConverter__conversionMessage" aria-live="polite">
        {conversionString && display && !validationMessage && <p>{conversionString}</p>}
      </div>
      {loading.loadingCoversion && <FontAwesomeIcon icon={faSpinner} className="currencyConverter__spinner" />}
      {display && conversionString && !validationMessage && (
        <div className="currencyConverter__timer">
          <p>Expires in:</p>
          <p>{Math.floor(time / 60)}'</p>
          <p>{(time % 60).toString().padStart(2, '0')}''</p>
        </div>
      )}
      {validationMessage && display && (
        <div className="currencyConverter__conversionMessage">
          <p aria-live="polite" style={{ color: 'red' }}>
            {validationMessage}
          </p>
        </div>
      )}
      <button className="currencyConverter__convertButton" onClick={fetchConversion} aria-label={baseCurrency && counterCurrency ? `Convert ${baseCurrency.name} to ${counterCurrency.name}` : null}>
        Convert
      </button>
      {error && <p>something went wrong...</p>}
    </div>
  );
}

export default CurrencyConverter;
