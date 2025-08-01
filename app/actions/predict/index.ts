export function setPolymarketStaging(isPolymarketStaging: boolean) {
  return {
    type: 'SET_POLYMARKET_STAGING',
    isPolymarketStaging,
  };
}

export function setGeolocationCheck(isGeolocationCheck: boolean) {
  return {
    type: 'SET_GEOLOCATION_CHECK',
    isGeolocationCheck,
  };
}

export function setGeolocationData(countryCode: string) {
  return {
    type: 'SET_GEOLOCATION_DATA',
    countryCode,
  };
}
