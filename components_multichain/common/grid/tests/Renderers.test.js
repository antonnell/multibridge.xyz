import { render, screen } from '@testing-library/react';
import {
  timeRenderer,
  contractRenderer,
  chainRenderer,
  statusRenderer,
  addressRenderer,
  sentCellRenderer,
} from '../Renderers';
import moment from 'moment';

describe('Renderers', () => {
  test('timeRenderer renders few mins ago format', () => {
    const fewMinsBack = moment()
      .subtract(5, 'minutes')
      .format('YYYY-MM-DD HH:mm');
    render(timeRenderer({ value: fewMinsBack }));
    screen.getByText('minutes ago', { exact: false });
  });
  test('timeRenderer renders normal format for a day older time', () => {
    const aDayBack = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm');
    render(timeRenderer({ value: aDayBack }));
    expect(screen.queryByText(' ago', { exact: false })).toBeNull();
    expect(
      screen.getByText(moment(aDayBack).format('YYYY/MM/DD'), { exact: false })
    ).toBeInTheDocument();
  });

  test('chainRenderer renders', () => {
    render(chainRenderer({ value: { icon: '/iconpath', text: 'testchain' } }));
    expect(screen.getByText('testchain')).toBeInTheDocument();
  });
  test('contractRenderer formats contract address', () => {
    // TODO: Tests to be added once we know the format
    contractRenderer('0');
  });
  test('addressRenderer formats contract address', () => {
    render(
      addressRenderer({
        value: {
          network: 'N1',
          coinIcon: '/path/coinicon',
          address: 'x909090909099090',
        },
      })
    );
  });
  test('statusRenderer renders status', () => {
    render(statusRenderer({ value: true }));
    render(statusRenderer({ value: false }));
  });

  test('Sent Title renders Sent, received fields', () => {
    render(
      sentCellRenderer({
        value: { icon: '/path/icon', sentAmount: 12.2, receivedAmount: 34.4 },
      })
    );
    expect(
      screen.queryByText('Sent: 12.2', { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Received: 34.4', { exact: false })
    ).toBeInTheDocument();
  });
});
