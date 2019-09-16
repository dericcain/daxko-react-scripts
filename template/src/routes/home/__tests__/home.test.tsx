import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Home } from 'Routes/home';

describe('<Home />', () => {
  it('should toggle "Yes" and "No" when the button has been clicked', () => {
    const { getByText } = render(<Home appVersion="1" />);
    const text = getByText(/has the button been clicked/i);
    const button = getByText(/click me/i);

    expect(text).toHaveTextContent(/no/i);

    fireEvent.click(button);

    expect(text).toHaveTextContent(/yes/i);
  });
});
