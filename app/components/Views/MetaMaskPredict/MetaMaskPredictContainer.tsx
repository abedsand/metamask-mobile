import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MetaMaskPredict from './MetaMaskPredict';
import MetaMaskPredictPositions from './MetaMaskPredictPositions';
import { NavigationIcon } from './NavigationBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const MetaMaskPredictContainer = () => {
  const [currentScreen, setCurrentScreen] = useState<NavigationIcon>(
    NavigationIcon.Storefront,
  );

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
      case NavigationIcon.Bank:
        return (
          <MetaMaskPredictPositions
            selectedIcon={currentScreen}
            onNavigate={handleNavigate}
          />
        );
      case NavigationIcon.Chart:
        return (
          <MetaMaskPredict
            selectedIcon={currentScreen}
            onNavigate={handleNavigate}
          />
        );
      case NavigationIcon.Money:
        return (
          <MetaMaskPredict
            selectedIcon={currentScreen}
            onNavigate={handleNavigate}
          />
        );
      case NavigationIcon.Setting:
        return (
          <MetaMaskPredict
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
