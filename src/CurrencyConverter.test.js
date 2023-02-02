import { render, screen } from '@testing-library/react';
import CurrencyConverter from './CurrencyConverter';

test('renders learn react link', () => {
  render(<CurrencyConverter />);
  const linkElement = screen.getByText(/Amount/i);
  expect(linkElement).toBeInTheDocument();
});
