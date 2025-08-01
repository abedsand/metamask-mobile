/**
 * Checks if a user should be blocked based on their country code
 * @param countryCode - The country code from the geolocation API (e.g., "US-VA", "FR")
 * @returns boolean - true if user should be blocked, false otherwise
 */
export const shouldBlockUserByLocation = (countryCode: string): boolean => {
  if (!countryCode) {
    return false;
  }

  const country = countryCode.split('-')[0].toUpperCase();

  // Block users from US, France, and Brazil
  const blockedCountries = ['US', 'FR', 'BR'];

  return blockedCountries.includes(country);
};

/**
 * Formats the country code for display
 * @param countryCode - The raw country code from the API
 * @returns string - Formatted country code
 */
export const formatCountryCode = (countryCode: string): string => {
  if (!countryCode) {
    return 'Unknown';
  }

  if (countryCode.includes('-')) {
    const [country, state] = countryCode.split('-');
    return `${country} (${state})`;
  }

  return countryCode;
};
