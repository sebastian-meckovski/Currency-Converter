import { render, screen, fireEvent } from '@testing-library/react';
import CurrencyConverter from './CurrencyConverter';
import { calculateRate, listItemRender } from './utils';

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
