// Utility to format currency consistently across the app
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === undefined || amount === null) return '';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0, // Simplified for tech products usually
    maximumFractionDigits: 2,
  }).format(amount);
};
