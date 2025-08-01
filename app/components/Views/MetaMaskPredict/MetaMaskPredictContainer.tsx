import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import MetaMaskPredict from './MetaMaskPredict';
import MetaMaskPredictPositions from './MetaMaskPredictPositions';
import MetaMaskPredictProfit from './MetaMaskPredictProfit';
import MetaMaskPredictSettings from './MetaMaskPredictSettings';
import { NavigationIcon } from './NavigationBar';
import { selectIsGeolocationCheck } from '../../../selectors/predict';
import { useGeolocation } from '../../../util/predict/hooks';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const MetaMaskPredictContainer = () => {
  const [currentScreen, setCurrentScreen] = useState<NavigationIcon>(
    NavigationIcon.Storefront,
  );
  const [isLocationChecked, setIsLocationChecked] = useState(false);

  const isGeolocationCheck = useSelector(selectIsGeolocationCheck);
  const { fetchGeolocation } = useGeolocation();

  useEffect(() => {
    const checkGeolocation = async () => {
      if (isGeolocationCheck && !isLocationChecked) {
        try {
          await fetchGeolocation();
          setIsLocationChecked(true);
        } catch (error) {
          console.error('Failed to check geolocation:', error);
          setIsLocationChecked(true);
        }
      } else if (!isGeolocationCheck) {
        setIsLocationChecked(false);
      }
    };

    checkGeolocation();
  }, [isGeolocationCheck, isLocationChecked, fetchGeolocation]);

  const handleNavigate = (icon: NavigationIcon) => {
    setCurrentScreen(icon);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case NavigationIcon.Storefront:
        return (
          <MetaMaskPredict
            selectedIcon={currentScreen}
            onNavigate={handleNavigate}
          />
        );
      case NavigationIcon.Chart:
        return (
          <MetaMaskPredictPositions
            selectedIcon={currentScreen}
            onNavigate={handleNavigate}
          />
        );
      case NavigationIcon.Money:
        return (
          <MetaMaskPredictProfit
            selectedIcon={currentScreen}
            onNavigate={handleNavigate}
          />
        );
      case NavigationIcon.Setting:
        return (
          <MetaMaskPredictSettings
            selectedIcon={currentScreen}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <MetaMaskPredict
            selectedIcon={currentScreen}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

export default MetaMaskPredictContainer;
