import { useDispatch } from 'react-redux';
import { setGeolocationData } from '../../../actions/predict';

export const useGeolocation = () => {
  const dispatch = useDispatch();

  const fetchGeolocation = async (): Promise<string> => {
    try {
      const response = await fetch(
        'https://on-ramp.api.cx.metamask.io/geolocation',
      );

      if (!response.ok) {
        throw new Error('Failed to fetch geolocation');
      }

      const countryCode = await response.text();

      dispatch(setGeolocationData(countryCode));

      return countryCode;
    } catch (error) {
      console.error('Error fetching geolocation:', error);
      return '';
    }
  };

  return { fetchGeolocation };
};
