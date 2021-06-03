import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import Swap from '../Swap';
import userEvent from '@testing-library/user-event';
import WalletContext from '../../../framework/WalletContext';
const icon = '/some/path';

describe('Swap', () => {
  test('renders Swap and and displays Connect Wallet when not connected', () => {
    const onSwap = jest.fn();
    render(<Swap onSwap={onSwap} />);
    const button = screen.getByRole('button', {
      name: /connect wallet/i,
    });
  });
  test('allow from, to field changes', () => {
    const onSwap = jest.fn();

    render(
      <WalletContext.Provider
        value={{ wallet: 'metamask', setWallet: () => null }}
      >
        <Swap onSwap={onSwap} />
      </WalletContext.Provider>
    );

    const amountTextBox = screen.getAllByLabelText('amount')[0]; // get first textbox
    userEvent.type(amountTextBox, '345.56');

    const button = screen.getByRole('button', {
      name: 'Swap',
    });
    userEvent.click(button);
    expect(onSwap).toBeCalled();
    const params = onSwap.mock.calls[0][0];
    expect(params.from.amount).toEqual(345.56);
  });
});
