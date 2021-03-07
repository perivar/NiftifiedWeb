import React from 'react';
import { render } from '@testing-library/react';
import { App } from './app/Index';

test('renders login form', () => {
  const { getByText } = render(<App />);
  const textElement = getByText(/Login/i);
  expect(textElement).toBeInTheDocument();
});
