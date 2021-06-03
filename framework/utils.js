import moment from 'moment';
import config from '../config';

const addressFormatConfig = config.addressFormat;
const formatAddress = (
  address = '',
  { thresholdLength, prefixLength, suffixLength, dots } = addressFormatConfig
) => {
  if (address.length > thresholdLength) {
    return `${address.substr(0, prefixLength)}${dots}${address.substr(
      address.length - suffixLength,
      address.length
    )}`;
  }
  return address;
};
const ellipsify = (str, len) => {
  if (str.length <= len) return str;
  return `${str.substr(0, len - 3)}...`;
};
const timeFromNow = (
  dateTime,
  defaultFormat = config.timeFromNow.defaultFormat
) => {
  const { cutOffSecs } = config.timeFromNow;
  const valueMoment = moment(dateTime);
  const diff = moment().diff(valueMoment, 'seconds');
  let dateText = moment(valueMoment).format(defaultFormat);
  if (diff < cutOffSecs) dateText = moment(valueMoment).fromNow();
  return dateText;
};
const feeFormatter = (fee) =>
  Number(fee)
    .toFixed(10)
    .replace(/\.?0+$/, '');

const formatMessage = (message, data) => {
  let formattedMsg = message;
  Object.keys(data).forEach((key) => {
    formattedMsg = formattedMsg.replace(`$${key}$`, data[key]);
  });
  return formattedMsg;
};
export { formatAddress, ellipsify, formatMessage, timeFromNow, feeFormatter };
