import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  test('renders icon button', () => {
    const iconSrc = '/some/path/to/icon';
    render(
      <Button icon={iconSrc} variant="primary">
        hello
      </Button>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
    const img = screen.getByAltText('icon');
    expect(img.src).toContain(iconSrc);
  });
  test('renders button without icon', () => {
    render(<Button variant="primary">hello</Button>);
    expect(screen.getByText('hello')).toBeInTheDocument();
    const img = screen.queryByAltText('icon');
    expect(img).not.toBeInTheDocument();
  });
});
