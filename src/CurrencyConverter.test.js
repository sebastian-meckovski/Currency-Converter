import { render, screen, fireEvent } from '@testing-library/react';
import CurrencyConverter from './CurrencyConverter';
import { calculateRate, isValidNumber, decimalPlaces } from './utils';

test('Check for "Amount" label', () => {
  render(<CurrencyConverter />);
  const linkElement = screen.getByText(/Amount/i);
  expect(linkElement).toBeInTheDocument();
});

test('convert button click', async () => {
  render(<CurrencyConverter />);
  const convertButton = screen.getByText(/Convert/i);
  fireEvent.click(convertButton);
  const result = await screen.findByTestId('test-convert');
  expect(result).toBeInTheDocument();
});

test('calculateRate returns a number', () => {
  const result = calculateRate(15, 50);
  expect(typeof result).toBe('string');
  expect(result).toBe('750');
});

test('isValidNumber method', () => {
  const result = isValidNumber(50);
  const result2 = isValidNumber('50');
  const result3 = isValidNumber(49.99);
  const result4 = isValidNumber('49.99');
  const result5 = isValidNumber('49.99.4');
  const result6 = isValidNumber('213b');
  expect(result).toBe(true);
  expect(result2).toBe(true);
  expect(result3).toBe(true);
  expect(result4).toBe(true);
  expect(result5).toBe(false);
  expect(result6).toBe(false);
});

test('decimalPlaces method', () => {
  const result = decimalPlaces(4);
  const result1 = decimalPlaces(4.5);
  const result3 = decimalPlaces(4.5432);
  expect(result).toBe(0);
  expect(result1).toBe(1);
  expect(result3).toBe(4);
});
