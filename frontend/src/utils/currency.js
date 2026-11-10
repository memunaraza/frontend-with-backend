const pkrPerCurrency = {
  PKR: 1,
  USD: 277,
  EUR: 309,
}

export function toPKR(price, currency = 'PKR') {
  if (typeof price !== 'number' || !Number.isFinite(price)) return null
  const rate = pkrPerCurrency[currency] ?? pkrPerCurrency.PKR
  return Math.round(price * rate)
}

export function formatPKR(price, currency = 'PKR') {
  const amount = toPKR(price, currency)
  if (amount === null) return 'Price on request'
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
  }).format(amount)
}
