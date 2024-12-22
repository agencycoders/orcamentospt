/**
 * Format a number as currency in Euros (EUR)
 * @param value - The number to format
 * @returns Formatted string in Euros
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number as a percentage
 * @param value - The number to format
 * @returns Formatted string with percentage
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

/**
 * Format a number with decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('pt-PT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Parse a localized number string back to a number
 * @param value - The string to parse
 * @returns Parsed number or 0 if invalid
 */
export const parseLocalizedNumber = (value: string): number => {
  // Remove currency symbol, spaces and convert decimal comma to dot
  const normalized = value
    .replace(/[€\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
};
