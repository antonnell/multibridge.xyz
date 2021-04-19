import BigNumber from 'bignumber.js'

// todo: get navigator declared somehow? probably an issue with using nextjs
// function getLang() {
//  if (window.navigator.languages != undefined)
//   return window.navigator.languages[0];
//  else
//   return window.navigator.language;
// }

export function formatCurrencyWithSymbol(amount, symbol) {
  return `${amount} ${symbol}`
}

export function formatCurrency(amount, decimals=2) {
  if(!isNaN(amount)) {
    const formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return formatter.format(amount)
  } else {
    return 0
  }
}

export function formatCurrencySmall(amount) {
  if(!isNaN(amount)) {

    let decimals = 2
    if(BigNumber(amount).gte(1000000)) {
      decimals = 0
    }
    if(BigNumber(amount).lte(1)) {
      decimals = 4
    }
    if(BigNumber(amount).lte(0.0005)) {
      decimals = 6
    }

    const formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return formatter.format(amount)
  } else {
    return 0
  }
}

export function formatAddress(address, length='short') {
  if (address && length==='short') {
    address = address.substring(0,6)+'...'+address.substring(address.length-4,address.length)
    return address
  } else if (address && length==='medium') {
    address = address.substring(0,12)+'...'+address.substring(address.length-8,address.length)
    return address
  } else if (address && length==='long') {
    address = address.substring(0,18)+'...'+address.substring(address.length-12,address.length)
    return address
  } else {
    return null
  }
}

export function bnDec(decimals) {
  return new BigNumber(10)
          .pow(parseInt(decimals))
}
