import { formatMessage, formatAddress } from '../utils';

describe('Utils', () => {
  test('formats messages replacing values', () => {
    const message = 'When $boy$ met $girl$';
    expect(formatMessage(message, { boy: 'Harry', girl: 'Sally' })).toEqual(
      'When Harry met Sally'
    );
  });
  test('format address', () => {
    const format = {
      thresholdLength: 5,
      prefixLength: 2,
      suffixLength: 2,
      dots: '.....',
    };
    expect(formatAddress('1234567890')).toContain('1234567890');
    expect(formatAddress('1234567890', format)).toEqual('12.....90');
  });
});
